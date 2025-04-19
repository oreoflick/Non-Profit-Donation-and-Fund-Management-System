import { 
    createProject, 
    getAllProjects, 
    getProjectById, 
    updateProject, 
    deleteProject 
} from '../models/projectModel.js';
import { catchAsync, AppError } from '../middleware/errorMiddleware.js';

export const createNewProject = catchAsync(async (req, res) => {
    const { name, description, goalAmount } = req.body;
    const project = await createProject({ name, description, goalAmount });
    
    res.status(201).json({
        status: 'success',
        message: 'Project created successfully',
        project
    });
});

export const listProjects = catchAsync(async (req, res) => {
    const projects = await getAllProjects();
    res.json({
        status: 'success',
        results: projects.length,
        projects
    });
});

export const getProject = catchAsync(async (req, res) => {
    const { id } = req.params;
    const project = await getProjectById(id);
    
    if (!project) {
        throw new AppError('Project not found', 404);
    }

    res.json({
        status: 'success',
        project
    });
});

export const updateProjectDetails = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { name, description, goalAmount, status } = req.body;

    const existingProject = await getProjectById(id);
    if (!existingProject) {
        throw new AppError('Project not found', 404);
    }

    const updatedProject = await updateProject(id, {
        name,
        description,
        goalAmount,
        status
    });

    if (!updatedProject) {
        throw new AppError('No updates provided', 400);
    }

    res.json({
        status: 'success',
        message: 'Project updated successfully',
        project: updatedProject
    });
});

export const removeProject = catchAsync(async (req, res) => {
    const { id } = req.params;
    
    const existingProject = await getProjectById(id);
    if (!existingProject) {
        throw new AppError('Project not found', 404);
    }

    await deleteProject(id);
    res.json({
        status: 'success',
        message: 'Project deleted successfully'
    });
});