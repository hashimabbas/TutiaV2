import { z } from 'zod';

/**
 * ----------------------------------------------------
 *  OPPORTUNITY STAGES (matching App\Models\Opportunity)
 * ----------------------------------------------------
 */

export const opportunityStages = [
    'New Lead',
    'Qualification',
    'Needs Analysis',
    'Proposal Sent',
    'Negotiation',
    'Won',
    'Lost',
] as const;

/**
 * -----------------------------------------------------------------
 *  ZOD SCHEMA — matches your Laravel validation EXACTLY
 * -----------------------------------------------------------------
 */

export const opportunitySchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional().nullable(),

    company_id: z.string().min(1, 'Company is required'),

    contact_id: z.string().optional().nullable(),
    assigned_user_id: z.string().optional().nullable(),
    source_id: z.string().optional().nullable(),

    value: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val) =>
            val === '' || val === undefined ? undefined : Number(val),
        )
        .refine((val) => val === undefined || val >= 0, 'Value must be >= 0'),

    stage: z.enum(opportunityStages),

    probability: z.number().min(0).max(100),

    expected_close_date: z.date().optional().nullable(),

    notes: z.string().optional().nullable(),

    next_step_label: z.string().optional().nullable(),
    next_step_due_date: z.date().optional().nullable(),
});

/**
 * ---------------------------------------------------
 *  TYPE FOR REACT FORM (inferred from schema)
 * ---------------------------------------------------
 */

export type OpportunityFormData = z.infer<typeof opportunitySchema>;
