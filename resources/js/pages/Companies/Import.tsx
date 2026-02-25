import React from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { route } from 'ziggy-js';
import { PageProps } from '@/types';
import { Download, Terminal, AlertCircle, Info, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CompaniesImport: React.FC = () => {
    const { props } = usePage<PageProps>();
    const { errors, flash } = props;

    const { data, setData, post, processing, progress } = useForm<{ file: File | null }>({
        file: null,
    });

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (data.file) {
            post(route('companies.import.handle'));
        }
    }

    const breadcrumbs = [
        { title: 'Companies', href: route('companies.index') },
        { title: 'Import' }
    ];

    // --- UPDATED TEMPLATE ---
    // Includes all possible fields. The example row demonstrates leaving some fields blank.
    const csvTemplateHeader = "name,website,email,phone_number,industry,type,source,number_of_employees,annual_revenue,linkedin_url,address,description";
    const csvTemplateExample = "\"Global Tech Inc.\",\"https://globaltech.com\",\"contact@globaltech.com\",\"+1-555-0101\",\"Technology\",\"Customer\",\"Referral\",\"500\",\"10000000.00\",\"https://linkedin.com/company/globaltech\",\"123 Tech Way, Silicon Valley, CA\",\"A leading provider of cloud solutions.\"\n" +
        "\"New Startup Co\",\"\",\"info@newstartup.com\",\"\",\"FinTech\",\"Prospect\",\"Website\",\"15\",\"500000.00\",\"\",\"\",\"\"";

    const downloadTemplate = () => {
        const fullCsv = `${csvTemplateHeader}\n${csvTemplateExample}`;
        const blob = new Blob([fullCsv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "companies-import-template.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Import Companies" />

            <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Import Companies</CardTitle>
                        <CardDescription>
                            Upload a CSV file to bulk-create companies. The file must include a header row.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="file">CSV File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".csv,text/csv"
                                    onChange={(e) => setData('file', e.target.files ? e.target.files[0] : null)}
                                    disabled={processing}
                                />
                                {errors.file && <p className="text-sm text-red-600 mt-1">{errors.file}</p>}
                            </div>

                            {processing && progress && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress.percentage}%` }}></div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-medium text-sm">Instructions:</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                                    {/* --- UPDATED INSTRUCTIONS --- */}
                                    <li>The first row of your CSV must be a header row matching the template columns.</li>
                                    <li><strong>Required column:</strong> `name`</li>
                                    <li><strong>Recommended columns:</strong> `email`, `website`, `phone_number`, `industry`, `type`, etc.</li>
                                    <li>The `email` column, if provided, must be unique for each company.</li>
                                    <li>
                                        <Button type="button" variant="link" size="sm" className="p-0 h-auto" onClick={downloadTemplate}>
                                            <Download className="mr-1 h-3 w-3" />
                                            Download a template CSV with all possible columns.
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Link href={route('companies.index')}>
                                <Button type="button" variant="outline" disabled={processing}>Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={!data.file || processing}>
                                {processing ? 'Importing...' : 'Start Import'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
                {flash?.warning && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Import Warnings/Errors: {flash.warning}</AlertTitle>
                        <AlertDescription>
                            <p className="mb-2">The following rows failed to import due to validation issues or internal errors:</p>

                            {/* Display the detailed errors from the backend */}
                            {(flash.import_errors as string[])?.length > 0 ? (
                                <ul className="mt-2 list-disc list-inside space-y-1 max-h-48 overflow-y-auto bg-red-900/10 p-2 rounded-md">
                                    {(flash.import_errors as string[]).map((error, index) => (
                                        <li key={index} className="text-sm text-red-100">{error}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm">Check the logs for more details.</p>
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Check for a standard success message */}
                {flash?.success && !flash?.warning && (
                    <Alert className="mb-4 border-green-500 text-green-700 bg-green-50 dark:bg-green-900/20">
                        <Info className="h-4 w-4 text-green-700" />
                        <AlertTitle>Import Complete</AlertTitle>
                        <AlertDescription>{flash.success}</AlertDescription>
                    </Alert>
                )}

                {/* ... rest of the component (Card with form) ... */}
            </div>
        </AppLayout>
    );
};

export default CompaniesImport;
