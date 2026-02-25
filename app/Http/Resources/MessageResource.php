<?php

// app/Http/Resources/MessageResource.php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class MessageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'message' => $this->message,
            'attachment' => $this->attachment, // The raw path
            // 'attachment_url' => $this->attachment ? Storage::disk('public')->url($this->attachment) : null, // Generate URL
            'created_at' => $this->created_at->diffForHumans(), // Human readable format
            'created_at_iso' => $this->created_at->toIso8601String(), // ISO format

            // --- FIX: Use the named route to generate the download URL ---
            'attachment_url' => $this->attachment ? route('messages.download.attachment', $this->resource) : null,
            // --- END FIX ---
            // Add other fields like is_read if needed
        ];
    }

}
