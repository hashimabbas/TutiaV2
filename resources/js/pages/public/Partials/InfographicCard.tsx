import React from 'react';
import { ChevronDown, Check, Clock, Globe, Thermometer, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Helper component for single data row
const DataRow: React.FC<{ label: string; value: string; color: string; icon: React.ElementType }> = ({ label, value, color: colorClass, icon: Icon }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="flex items-center text-gray-700 dark:text-gray-300">
            <Icon className={cn("h-4 w-4 mr-2", colorClass)} />
            {label}
        </span>
        <span className={cn("font-semibold", colorClass)}>{value}</span>
    </div>
);

// Main Infographic Card
export default function InfographicCard() {
    return (
        <Card className="p-0 border-4 border-yellow-400 max-w-sm mx-auto bg-white dark:bg-gray-800 shadow-2xl relative">
            <CardContent className="p-4 space-y-3">
                {/* Status Header */}
                <div className="flex items-center text-sm font-bold text-gray-800 dark:text-gray-100 border-b pb-2">
                    <Zap className="h-4 w-4 mr-2 text-green-500" />
                    <span>LOAD STATUS</span>
                </div>

                {/* ETA */}
                <div className="text-sm font-extrabold text-gray-900 dark:text-white border-b pb-2">
                    <span className="text-xs font-normal text-muted-foreground block">ETA:</span>
                    June 3 | 6:17 PM
                </div>

                {/* Quality Risk Section */}
                <div className="space-y-2">
                    <h4 className="flex items-center text-sm font-extrabold text-indigo-700 dark:text-indigo-400">
                        <ChevronDown className="h-4 w-4 mr-1" /> Quality Risk
                    </h4>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block ml-5">MEDIUM</span>
                    <div className="ml-5 space-y-1">
                        <DataRow label="Temperature" value="OK" color="text-green-500" icon={Thermometer} />
                        <DataRow label="Humidity" value="OK" color="text-green-500" icon={Check} />
                        <DataRow label="Tilt/Shock" value="OK" color="text-green-500" icon={Check} />
                    </div>
                </div>

                {/* Security Risk Section */}
                <div className="space-y-2">
                    <h4 className="flex items-center text-sm font-extrabold text-indigo-700 dark:text-indigo-400">
                        <ChevronDown className="h-4 w-4 mr-1" /> Security Risk
                    </h4>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 block ml-5">MEDIUM</span>
                    <div className="ml-5 space-y-1">
                        <DataRow label="Door" value="OK" color="text-green-500" icon={Check} />
                        <DataRow label="Dwell Time" value="OK" color="text-green-500" icon={Check} />
                        <DataRow label="Route" value="OK" color="text-green-500" icon={Globe} />
                        <DataRow label="CO2 Emissions" value="943 kg" color="text-gray-700 dark:text-gray-300" icon={Zap} />
                    </div>
                </div>
            </CardContent>
            {/* Decorative Label */}
            <div className="absolute -bottom-4 right-1/2 translate-x-1/2 px-3 py-1 bg-gray-800 text-yellow-400 text-xs font-bold shadow-xl">
                MID MILE
            </div>
        </Card>
    );
}
