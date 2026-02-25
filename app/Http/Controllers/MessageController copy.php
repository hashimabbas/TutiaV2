<?php

namespace App\Http\Controllers;

use App\Models\Message; // Use the correct model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\MessageResource; // Optional: For consistent data shaping

class MessageController extends Controller
{
    /**
     * Display the public contact form.
     * (Keep this if you still need the public form separate)
     */
    // In MessageController.php
    public function publicIndex(): Response
    {
        // Assuming you have a separate public contact page component
        return Inertia::render('contact-us/Index'); // Or your actual public form component path
    }

public function adminIndex(Request $request): Response
{
    $paginatedMessages = Message::latest()->paginate(15)->withQueryString();

    return Inertia::render('Admin/Messages/Index', [
        // Use the resource collection - this wraps the paginator automatically
        'messages' => MessageResource::collection($paginatedMessages),
        'breadcrumbs' => [
            ['title' => 'Dashboard', 'href' => route('dashboard')],
            ['title' => 'Messages', 'href' => route('messages.index')]
        ],
        'filters' => $request->only(['search', 'status']),
    ]);
}
    /**
     * Store a new message from the public contact form.
     * (Keep this as is)
     */
    public function store(Request $request)
{
    // Validate the form inputs
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:20',
        'message' => 'required|string',
        'attachment' => 'nullable|file|mimes:jpg,jpeg,png,pdf,doc,docx,txt|max:5120', // 5MB Example
    ]);

    // If validation fails, return errors
    if ($validator->fails()) {
        return back()->withErrors($validator)->withInput();
    }

    // Store the validated data
    $validatedData = $validator->validated();

    // Check if there's an attachment, and store it in the public storage
    if ($request->hasFile('attachment')) {
        $path = $request->file('attachment')->store('attachments', 'public');
        $validatedData['attachment'] = $path;  // Store the relative path
    }

    // Store the message in the database
    Message::create($validatedData);

    // Redirect back with success message
    return back()->with('success', 'Your message has been sent!');
}

// In MessageController.php

    public function show(Message $message): Response
    {
        // ...
        return Inertia::render('Admin/Messages/Show', [
            'message' => new MessageResource($message), // Assuming MessageResource is set up
            'breadcrumbs' => [
                ['title' => 'Dashboard', 'href' => route('dashboard')],
                ['title' => 'Messages', 'href' => route('messages.index')], // CORRECTED
                ['title' => 'View Message', 'href' => route('messages.show', $message->id)], // CORRECTED
            ]
        ]);
    }

    public function destroy(Message $message): RedirectResponse
    {
        // 1. Delete the physical attachment file from storage, if one exists
        if ($message->attachment) {
            // The file path is relative (e.g., 'attachments/filename.pdf')
            // The disk is 'public' (where it was stored)

            // We use Storage::delete() to safely remove the file.
            Storage::disk('public')->delete($message->attachment);
        }

        // 2. Delete the record from the database
        $message->delete();

        // 3. Redirect back to the index with a success message
        return redirect()->route('messages.index')
                        ->with('success', 'Message deleted successfully.');
    }
       /**
     * Download the attachment for a specific message.
     */
    public function downloadAttachment(Message $message)
    {
        // 1. Check if the message has an attachment path
        if (!$message->attachment) {
            abort(404, 'No attachment found for this message.');
        }

        $filePath = $message->attachment; // This should be like 'attachments/filename.pdf'
        $disk = 'public';

        // 2. Check if the file exists physically
        if (!Storage::disk($disk)->exists($filePath)) {
            abort(404, 'File not found on disk.');
        }

        // 3. Get the original filename (for the downloaded file)
        $fileName = basename($filePath);

        // 4. Return the download response
        return Storage::disk($disk)->download($filePath, $fileName);
    }

    // Also update the breadcrumbs in adminIndex if they were wrong initially (though the code snippet looks correct there)


    // Note: An 'edit' or 'update' method for contact messages is uncommon.
    // You might add methods to mark as read/unread or add internal notes instead.
}
