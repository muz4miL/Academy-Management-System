// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Teacher API Endpoints
export const teacherApi = {
    // Get all teachers
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/teachers`);
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch teachers');
        }
        return data;
    },

    // Get single teacher by ID
    getById: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/teachers/${id}`);
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch teacher');
        }
        return data;
    },

    // Create new teacher
    create: async (teacherData: any) => {
        const response = await fetch(`${API_BASE_URL}/teachers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teacherData),
        });
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to create teacher');
        }
        return data;
    },

    // Update teacher
    update: async (id: string, teacherData: any) => {
        const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(teacherData),
        });
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to update teacher');
        }
        return data;
    },

    // Delete teacher
    delete: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/teachers/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to delete teacher');
        }
        return data;
    },
};

// Settings API Endpoints
export const settingsApi = {
    // Get settings
    get: async () => {
        const response = await fetch(`${API_BASE_URL}/config`);
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch settings');
        }
        return data;
    },

    // Update settings
    update: async (settingsData: any) => {
        const response = await fetch(`${API_BASE_URL}/config`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(settingsData),
        });
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to update settings');
        }
        return data;
    },
};

// Student API Endpoints
export const studentApi = {
    // Get all students
    getAll: async (filters?: { class?: string; group?: string; search?: string }) => {
        const queryParams = new URLSearchParams();
        if (filters?.class) queryParams.append('class', filters.class);
        if (filters?.group) queryParams.append('group', filters.group);
        if (filters?.search) queryParams.append('search', filters.search);

        const url = `${API_BASE_URL}/students${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await fetch(url);
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch students');
        }
        return data;
    },

    // Get single student by ID
    getById: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/students/${id}`);
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to fetch student');
        }
        return data;
    },

    // Create new student (admission)
    create: async (studentData: any) => {
        const response = await fetch(`${API_BASE_URL}/students`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        });
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to create student');
        }
        return data;
    },

    // Update student
    update: async (id: string, studentData: any) => {
        const response = await fetch(`${API_BASE_URL}/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        });
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to update student');
        }
        return data;
    },

    // Delete student
    delete: async (id: string) => {
        const response = await fetch(`${API_BASE_URL}/students/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (!data.success) {
            throw new Error(data.message || 'Failed to delete student');
        }
        return data;
    },
};

