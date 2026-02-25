import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { route } from 'ziggy-js';
import { Download } from 'lucide-react';

const ContactsImport: React.FC = () => {
    // Note: I'm disabling the `any` type error for the unused `e` parameter in handleSubmit.
    // A better fix is to use the data from the form hook directly.
    const { data, setData, post, processing, progress, errors } = useForm<{ file: File | null }>({ file: null });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Use the form's state directly instead of the event target for more reliability
        if (data.file) {
            post(route('contacts.import.handle'));
        }
    };

    const downloadTemplate = () => {
        const header = "first_name,last_name,email,phone,status,company_name";
        const example = "\"John\",\"Doe\",\"john.doe@example.com\",\"+1-555-0100\",\"New Lead\",\"Global Tech Inc.\"";
        const csv = `${header}\n${example}`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "contacts-template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Contacts', href: route('contacts.index') }, { title: 'Import' }]}>
            <Head title="Import Contacts" />
            <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Import Contacts</CardTitle>
                        <CardDescription>Upload a CSV file to bulk-create contacts. Provide the company name to link them automatically.</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="file">CSV File</Label>
                                <Input id="file" type="file" accept=".csv,text/csv" onChange={(e) => setData('file', e.target.files?.[0] || null)} disabled={processing} />
                                {errors.file && <p className="text-sm text-red-600 mt-1">{errors.file}</p>}
                            </div>

                            {/* --- CORRECTED SYNTAX --- */}
                            {/* We will implement a real progress bar here */}
                            {processing && progress && (
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: `${progress.percentage}%` }}
                                    ></div>
                                </div>
                            )}

                            <div>
                                <h4 className="font-medium text-sm">Instructions:</h4>
                                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1 space-y-1">
                                    <li>Required columns: <strong>first_name</strong>.</li>
                                    <li>To link a contact to a company, include a <strong>company_name</strong> column. The company must already exist.</li>
                                    <li><Button type="button" variant="link" size="sm" className="p-0 h-auto" onClick={downloadTemplate}><Download className="mr-1 h-3 w-3" /> Download a template.</Button></li>
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Link href={route('contacts.index')}><Button type="button" variant="outline" disabled={processing}>Cancel</Button></Link>
                            {/* Disable button if no file is selected */}
                            <Button type="submit" disabled={!data.file || processing}> {processing ? 'Importing...' : 'Start Import'} </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
};

export default ContactsImport;
