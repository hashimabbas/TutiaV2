<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Admin Index: List all posts (published, draft, archived).
     */
    public function index(Request $request)
    {
        $posts = Post::with('user:id,name')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Blog/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Public Index: List only published posts (Blog Home Page).
     */
    public function publicIndex()
    {
        $posts = Post::published()
            ->with('user:id,name')
            ->latest('published_at')
            ->paginate(10);

        return Inertia::render('public/Blog/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Public Show: Show a single published post.
     */
    public function publicShow(Post $post)
    {
        // Use Post policy or scope to ensure only published posts are shown
        if ($post->status !== 'published') {
             abort(404);
        }

        return Inertia::render('Public/Blog/Show', [
            'post' => $post->load('user:id,name'),
        ]);
    }

    /**
     * CRUD: Show create form.
     */
    public function create()
    {
        return Inertia::render('Admin/Blog/Create');
    }

    /**
     * CRUD: Store new post.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string|max:50',
            'status' => ['required', Rule::in(['draft', 'published', 'archived'])],
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('posts', 'public');
        }

        Post::create($validated);

        return Redirect::route('blog.index')->with('success', 'Post created successfully.');
    }

    /**
     * CRUD: Destroy post.
     */
     public function destroy(Post $post)
     {
         // 1. Delete image
         if ($post->image) {
             Storage::disk('public')->delete($post->image);
         }
         // 2. Delete record
         $post->delete();

         return Redirect::route('blog.index')->with('success', 'Post deleted.');
     }

    // ... (include edit and update methods similar to other controllers)
}
