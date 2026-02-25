import React from 'react';
import { LayoutGrid, List, Calendar } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export type TaskView = 'kanban' | 'list' | 'calendar';

interface ViewSwitcherProps {
    currentView: TaskView;
    onViewChange: (view: TaskView) => void;
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
    return (
        <ToggleGroup
            type="single"
            value={currentView}
            onValueChange={(value) => { if (value) onViewChange(value as TaskView) }}
            aria-label="Task view"
        >
            <ToggleGroupItem value="kanban" aria-label="Kanban view">
                <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="calendar" aria-label="Calendar view">
                <Calendar className="h-4 w-4" />
            </ToggleGroupItem>
        </ToggleGroup>
    );
};
