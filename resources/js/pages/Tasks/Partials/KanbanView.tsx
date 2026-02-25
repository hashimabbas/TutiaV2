import React, { useMemo, useState, useEffect } from 'react';
import { DndContext, closestCenter, DragEndEvent, useDroppable, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { isPast, isToday, isFuture, addDays } from 'date-fns';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Briefcase, Flag, User as UserIcon } from 'lucide-react';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// --- Kanban Card Component (use the enhanced version from above) ---
const getPriorityBadgeVariant = (priority: Task['priority']): BadgeProps['variant'] => { /* ... */ };
const KanbanCard: React.FC<{ task: Task; isOverlay?: boolean }> = ({ task, isOverlay }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        boxShadow: isOverlay ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' : 'none',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="mb-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                        <p className="font-semibold text-sm leading-tight">{task.title}</p>
                        <Badge variant={getPriorityBadgeVariant(task.priority)} className="capitalize flex-none">{task.priority}</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                        {task.opportunity && <Link href={route('opportunities.show', task.opportunity.id)} className="flex items-center gap-1.5 group"><Briefcase className="h-3 w-3 text-gray-400 group-hover:text-primary" /> <span className="group-hover:text-primary group-hover:underline">{task.opportunity.title}</span></Link>}
                        {task.contact && <Link href={route('contacts.show', task.contact.id)} className="flex items-center gap-1.5 group"><UserIcon className="h-3 w-3 text-gray-400 group-hover:text-primary" /> <span className="group-hover:text-primary group-hover:underline">{task.contact.first_name} {task.contact.last_name}</span></Link>}
                    </div>
                    <div className="flex justify-end items-center pt-2">
                        {task.assignedTo ? <TooltipProvider><Tooltip><TooltipTrigger><img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignedTo.name)}&background=random&color=fff&size=128`} alt={task.assignedTo.name} className="h-7 w-7 rounded-full border-2 border-white" /></TooltipTrigger><TooltipContent><p>Assigned to {task.assignedTo.name}</p></TooltipContent></Tooltip></TooltipProvider> : <div className="h-7 w-7" />}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};


// --- Kanban Column Component ---
const KanbanColumn: React.FC<{ id: string; title: string; tasks: Task[] }> = ({ id, title, tasks }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className="flex-1 min-w-[300px] max-w-[300px] bg-muted/60 rounded-xl p-3 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 px-1">{title} <span className="text-sm font-normal text-muted-foreground">{tasks.length}</span></h2>
            <div className="flex-grow overflow-y-auto">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map(task => <KanbanCard key={task.id} task={task} />)}
                </SortableContext>
            </div>
        </div>
    );
};


// --- Main Kanban View ---
type ColumnId = 'Overdue' | 'Due Today' | 'Upcoming' | 'Done';
export const KanbanView: React.FC<{ tasks: Task[] }> = ({ tasks: initialTasks }) => {
    // Local state to manage tasks for instant UI feedback
    const [taskItems, setTaskItems] = useState<Record<ColumnId, Task[]>>({ Overdue: [], 'Due Today': [], Upcoming: [], Done: [] });
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

    // Populate local state when initial tasks change
    useEffect(() => {
        setTaskItems({
            Overdue: initialTasks.filter(t => t.status === 'pending' && t.due_date && isPast(new Date(t.due_date)) && !isToday(new Date(t.due_date))),
            'Due Today': initialTasks.filter(t => t.status === 'pending' && t.due_date && isToday(new Date(t.due_date))),
            Upcoming: initialTasks.filter(t => t.status === 'pending' && (!t.due_date || isFuture(new Date(t.due_date)))),
            Done: initialTasks.filter(t => t.status === 'completed'),
        });
    }, [initialTasks]);

    const findColumn = (taskId: string | number): ColumnId | undefined => {
        return Object.keys(taskItems).find(columnId =>
            taskItems[columnId as ColumnId].some(task => task.id === taskId)
        ) as ColumnId | undefined;
    };

    const handleDragStart = (event: any) => {
        setActiveTask(event.active.data.current.task);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        setActiveTask(null);
        const { active, over } = event;
        if (!over) return;

        const activeColumn = findColumn(active.id);
        const overColumn = over.id as ColumnId;

        if (!activeColumn || !overColumn || activeColumn === overColumn) {
            // Reordering within the same column
            if (activeColumn) {
                const newItems = arrayMove(taskItems[activeColumn], active.data.current.sortable.index, over.data.current.sortable.index);
                setTaskItems(prev => ({ ...prev, [activeColumn]: newItems }));
            }
            return;
        }

        // --- Moving to a different column ---
        setTaskItems(prev => {
            const activeItems = prev[activeColumn];
            const overItems = prev[overColumn];
            const activeIndex = activeItems.findIndex(item => item.id === active.id);
            const overIndex = over.data.current?.sortable.index ?? overItems.length;

            const [movedItem] = activeItems.splice(activeIndex, 1);
            overItems.splice(overIndex, 0, movedItem);

            return { ...prev, [activeColumn]: [...activeItems], [overColumn]: [...overItems] };
        });

        // --- Send update to the backend ---
        const taskId = active.id;
        let updateData: { status?: string, due_date?: string } = {};

        if (overColumn === 'Done') {
            updateData.status = 'completed';
        } else {
            updateData.status = 'pending'; // Ensure it's pending if moved from Done
            if (overColumn === 'Due Today') updateData.due_date = new Date().toISOString().split('T')[0];
            if (overColumn === 'Upcoming') updateData.due_date = addDays(new Date(), 1).toISOString().split('T')[0]; // Set due date to tomorrow
        }

        router.put(route('tasks.update', taskId), { ...tasks.find(t => t.id === taskId), ...updateData }, { preserveScroll: true });
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                {Object.entries(taskItems).map(([title, tasks]) => (
                    <KanbanColumn key={title} id={title} title={title} tasks={tasks} />
                ))}
            </div>
            <DragOverlay>{activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}</DragOverlay>
        </DndContext>
    );
};
