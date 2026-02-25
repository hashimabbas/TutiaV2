import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { FileUp, Loader2, Download, Terminal, AlertCircle } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

const OpportunitiesImport: React.FC = () => {
    const { errors, flash } = usePage<PageProps>().props;

    const { data, setData, post, processing, progress } = useForm<{ file: File | null }>({
        file: null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (data.file) {
            post(route('opportunities.import.handle'));
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Opportunities', url: route('opportunities.index') }, { title: 'Import' }]}>
            <Head title="Import Opportunities" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileUp className="h-6 w-6" /> Import Opportunities
                            </CardTitle>
                            <CardDescription>
                                Upload a CSV file to bulk-import opportunities. Please ensure your file follows the required format.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Success with Errors Alert */}
                            {flash?.success && errors.import_errors && (
                                <Alert variant="default" className="border-yellow-500 text-yellow-800 dark:border-yellow-600 dark:text-yellow-200">
                                    <AlertCircle className="h-4 w-4 !text-yellow-600" />
                                    <AlertTitle>Import Partially Successful</AlertTitle>
                                    <AlertDescription>{flash.success}</AlertDescription>
                                </Alert>
                            )}

                            {/* Import Errors Alert */}
                            {errors.import_errors && (
                                <Alert variant="destructive">
                                    <Terminal className="h-4 w-4" />
                                    <AlertTitle>Import Errors</AlertTitle>
                                    <AlertDescription>
                                        <ul className="mt-2 list-disc list-inside space-y-1 max-h-48 overflow-y-auto">
                                            {/*
                                            Assert the type of import_errors to Record<string, string>.
                                            Now TypeScript knows that Object.values will return a string[].
                                            */}
                                            {Object.values(errors.import_errors as Record<string, string>).map((error, index) => (
                                                <li key={index}><code className="text-xs">{error}</code></li>
                                            ))}
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium mb-2">1. Download Template</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Start by downloading the template file. This ensures your data is in the correct format.
                                        Related fields like Company, Contact, User, and Lead Source must match existing names in the system exactly.
                                    </p>
                                    <a href={route('opportunities.import.template')}>
                                        <Button type="button" variant="outline">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Template.csv
                                        </Button>
                                    </a>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-2">2. Upload File</h3>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Once you've filled out the template, upload the CSV file here.
                                    </p>
                                    <Label htmlFor="file-upload">CSV File</Label>
                                    <Input
                                        id="file-upload"
                                        type="file"
                                        accept=".csv,text/csv"
                                        onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    />
                                    {progress && (
                                        <Progress value={progress.percentage} className="w-full mt-2" />
                                    )}
                                    {errors.file && <p className="text-sm text-destructive mt-2">{errors.file}</p>}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-4">
                            <Link href={route('opportunities.index')}>
                                <Button variant="outline" type="button" disabled={processing}>Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={!data.file || processing}>
                                {processing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...</>
                                ) : 'Start Import'}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </div>
        </AppLayout>
    );
};

export default OpportunitiesImport;
