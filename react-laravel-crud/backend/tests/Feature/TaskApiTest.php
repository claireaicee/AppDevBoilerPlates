<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_and_list_tasks(): void
    {
        $this->postJson('/api/tasks', ['title' => 'Write boilerplate'])
            ->assertCreated()
            ->assertJsonPath('title', 'Write boilerplate');

        $this->getJson('/api/tasks')->assertOk()->assertJsonCount(1);
    }

    public function test_title_is_required(): void
    {
        $this->postJson('/api/tasks', [])->assertUnprocessable()->assertJsonValidationErrors('title');
    }

    public function test_can_update_a_task(): void
    {
        $task = Task::factory()->create();

        $this->putJson("/api/tasks/{$task->id}", ['completed' => true])
            ->assertOk()
            ->assertJsonPath('completed', true);
    }

    public function test_can_delete_a_task(): void
    {
        $task = Task::factory()->create();

        $this->deleteJson("/api/tasks/{$task->id}")->assertNoContent();
        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
}
