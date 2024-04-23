import { Task } from "../model/task";
import pool from "../postgresDatabase";

export const getTasks = async () => {
    const result = await pool.query('SELECT * FROM public."tasks"');
    return result.rows;
};

export const getTask = async (id: string) => {
    const result = await pool.query('SELECT * FROM public."tasks" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Task not found");
    }
    return result.rows[0];
};

export const addTask = async (task: Task) => {
    const result = await pool.query('INSERT INTO public."tasks" (id, title, category, content, isfinished, duedate, priority) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [task.id, task.title, task.category, task.content, task.isFinished, task.dueDate, task.priority]);
    if (result.rowCount === 0) {
        throw new Error("Task not added");
    }
};

export const updateTask = async (id: string, task: Task) => {
    const result = await pool.query('UPDATE public."tasks" SET title = $2, category = $3, content = $4, isfinished = $5, duedate = $6, priority = $7 WHERE id = $1 RETURNING *', [id, task.title, task.category, task.content, task.isFinished, task.dueDate, task.priority]);
    if (result.rowCount === 0) {
        throw new Error("Task not found");
    }
    return result.rows[0];
};

export const deleteTask = async (id: string) => {
    const result = await pool.query('DELETE FROM public."tasks" WHERE id = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Task not found");
    }
};

export default { getTasks, getTask, addTask, updateTask, deleteTask };