<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class StoreContactRequest extends FormRequest
{
    public function authorize(): bool { return true; } // Or add authorization logic
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name'  => 'nullable|string|max:255',
            'email'      => 'nullable|email|max:255|unique:contacts,email',
            'phone'      => 'nullable|string|max:50',
            'job_title'  => 'nullable|string|max:255',
            'company_id' => 'nullable|exists:companies,id',
        ];
    }
}
