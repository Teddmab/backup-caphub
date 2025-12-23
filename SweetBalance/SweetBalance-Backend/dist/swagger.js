"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const buildSwaggerDefinition = () => ({
    openapi: '3.0.3',
    info: {
        title: 'SweetBalance API',
        version: '1.0.0',
        description: 'SweetBalance backend API for glucose tracking, goals, markets, shopping, and badges.',
        contact: {
            name: 'SweetBalance Team'
        }
    },
    servers: [
        {
            url: process.env.API_BASE_URL || 'http://localhost:3000',
            description: 'Local'
        }
    ],
    tags: [
        { name: 'Health' },
        { name: 'Auth' },
        { name: 'Glucose' },
        { name: 'Goals' },
        { name: 'Family' },
        { name: 'Shopping' },
        { name: 'Markets' },
        { name: 'Badges' }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            HealthResponse: {
                type: 'object',
                properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' }
                }
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    details: { type: 'object' }
                }
            },
            AuthUser: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    username: { type: 'string' },
                    firstName: { type: 'string', nullable: true },
                    lastName: { type: 'string', nullable: true }
                }
            },
            AuthUserWithTimestamps: {
                allOf: [
                    { $ref: '#/components/schemas/AuthUser' },
                    {
                        type: 'object',
                        properties: {
                            createdAt: { type: 'string', format: 'date-time' },
                            updatedAt: { type: 'string', format: 'date-time' }
                        }
                    }
                ]
            },
            AuthLoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 1 }
                }
            },
            AuthRegisterRequest: {
                type: 'object',
                required: ['email', 'password', 'username'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                    username: { type: 'string', minLength: 3 },
                    firstName: { type: 'string', nullable: true },
                    lastName: { type: 'string', nullable: true }
                }
            },
            AuthLoginResponse: {
                type: 'object',
                properties: {
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/AuthUser' }
                }
            },
            BloodGlucoseInput: {
                type: 'object',
                required: ['value'],
                properties: {
                    value: { type: 'number', minimum: 20, maximum: 600 },
                    mealBefore: { type: 'boolean', nullable: true },
                    activity: { type: 'string', nullable: true },
                    notes: { type: 'string', nullable: true },
                    photoUrl: { type: 'string', nullable: true }
                }
            },
            BloodGlucoseReading: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    value: { type: 'number' },
                    timestamp: { type: 'string', format: 'date-time' },
                    mealBefore: { type: 'boolean', nullable: true },
                    activity: { type: 'string', nullable: true },
                    notes: { type: 'string', nullable: true },
                    photoUrl: { type: 'string', nullable: true }
                }
            },
            GlucoseStats: {
                type: 'object',
                properties: {
                    average: { type: 'number' },
                    min: { type: 'number' },
                    max: { type: 'number' },
                    count: { type: 'number' }
                }
            },
            GoalInput: {
                type: 'object',
                required: ['title', 'targetValue'],
                properties: {
                    title: { type: 'string', minLength: 3 },
                    description: { type: 'string', nullable: true },
                    targetValue: { type: 'number', minimum: 1 },
                    currentValue: { type: 'number', minimum: 0 },
                    status: { type: 'string', enum: ['active', 'completed', 'paused'] }
                }
            },
            DiabetesGoal: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string', nullable: true },
                    targetValue: { type: 'number' },
                    currentValue: { type: 'number' },
                    status: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            FamilyMember: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    familyId: { type: 'string' },
                    userId: { type: 'string' },
                    role: { type: 'string', enum: ['parent', 'child'] },
                    joinedAt: { type: 'string', format: 'date-time' },
                    user: { $ref: '#/components/schemas/AuthUser' }
                }
            },
            Family: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    members: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/FamilyMember' }
                    }
                }
            },
            ShoppingListItem: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    listId: { type: 'string' },
                    name: { type: 'string' },
                    quantity: { type: 'number' },
                    unit: { type: 'string' },
                    checked: { type: 'boolean' }
                }
            },
            ShoppingList: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    title: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
                    items: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/ShoppingListItem' }
                    }
                }
            },
            Market: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    type: { type: 'string' },
                    address: { type: 'string' },
                    lat: { type: 'number' },
                    lng: { type: 'number' },
                    hours: { type: 'string' },
                    website: { type: 'string' },
                    phone: { type: 'string' }
                }
            },
            MarketProduct: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    marketId: { type: 'string' },
                    name: { type: 'string' },
                    price: { type: 'number' },
                    currency: { type: 'string' },
                    category: { type: 'string' },
                    calories: { type: 'number' },
                    carbs: { type: 'number' },
                    protein: { type: 'number' },
                    fat: { type: 'number' },
                    glycemicIndex: { type: 'number' },
                    lastUpdated: { type: 'string', format: 'date-time' }
                }
            },
            MarketPreferenceInput: {
                type: 'object',
                required: ['marketId', 'frequency', 'preferredDays'],
                properties: {
                    marketId: { type: 'string' },
                    frequency: { type: 'string', enum: ['weekly', 'biweekly', 'monthly'] },
                    preferredDays: { type: 'string', description: 'JSON string of preferred days' }
                }
            },
            MarketPreference: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    marketId: { type: 'string' },
                    frequency: { type: 'string' },
                    preferredDays: { type: 'string' }
                }
            },
            Badge: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    description: { type: 'string' },
                    icon: { type: 'string' },
                    category: { type: 'string' }
                }
            },
            BadgeUnlockInput: {
                type: 'object',
                required: ['badgeId'],
                properties: {
                    badgeId: { type: 'string' }
                }
            },
            UserAchievement: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    badgeId: { type: 'string' },
                    unlockedAt: { type: 'string', format: 'date-time' },
                    badge: { $ref: '#/components/schemas/Badge' }
                }
            }
        }
    },
    paths: {
        '/health': {
            get: {
                tags: ['Health'],
                summary: 'Health check',
                responses: {
                    200: {
                        description: 'API is up',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/HealthResponse' }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/auth/register': {
            post: {
                tags: ['Auth'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AuthRegisterRequest' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'User created',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthUserWithTimestamps' }
                            }
                        }
                    },
                    400: { description: 'Validation error' }
                }
            }
        },
        '/api/v1/auth/login': {
            post: {
                tags: ['Auth'],
                summary: 'Login using Firebase (client-side)',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/AuthLoginRequest' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Login instructions',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                        docs: { type: 'string' },
                                        note: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    401: { description: 'Invalid credentials' }
                }
            }
        },
        '/api/v1/auth/me': {
            get: {
                tags: ['Auth'],
                summary: 'Get current user',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'User profile',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/AuthUserWithTimestamps' }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        '/api/v1/auth/logout': {
            post: {
                tags: ['Auth'],
                summary: 'Logout (mock)',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Logged out' },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        '/api/v1/glucose/readings': {
            post: {
                tags: ['Glucose'],
                summary: 'Create blood glucose reading',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/BloodGlucoseInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Reading created',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/BloodGlucoseReading' }
                            }
                        }
                    },
                    400: { description: 'Validation error' },
                    401: { description: 'Unauthorized' }
                }
            },
            get: {
                tags: ['Glucose'],
                summary: 'Get last 30 readings',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Readings list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/BloodGlucoseReading' }
                                }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        '/api/v1/glucose/stats': {
            get: {
                tags: ['Glucose'],
                summary: 'Get glucose statistics',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Statistics',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/GlucoseStats' }
                            }
                        }
                    },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        '/api/v1/goals/goals': {
            post: {
                tags: ['Goals'],
                summary: 'Create goal',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GoalInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Goal created',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/DiabetesGoal' }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Goals'],
                summary: 'List goals',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Goals list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/DiabetesGoal' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/goals/goals/{id}': {
            put: {
                tags: ['Goals'],
                summary: 'Update goal',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/GoalInput' }
                        }
                    }
                },
                responses: {
                    200: {
                        description: 'Goal updated',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/DiabetesGoal' }
                            }
                        }
                    },
                    404: { description: 'Goal not found' }
                }
            },
            delete: {
                tags: ['Goals'],
                summary: 'Delete goal',
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    200: { description: 'Goal deleted' },
                    404: { description: 'Goal not found' }
                }
            }
        },
        '/api/v1/family/': {
            post: {
                tags: ['Family'],
                summary: 'Create family and add current user as parent',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name'],
                                properties: { name: { type: 'string' } }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Family created',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Family' }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Family'],
                summary: 'List families current user belongs to',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Families list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Family' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/shopping/lists': {
            post: {
                tags: ['Shopping'],
                summary: 'Create shopping list',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['title'],
                                properties: { title: { type: 'string' } }
                            }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Shopping list created',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/ShoppingList' }
                            }
                        }
                    }
                }
            },
            get: {
                tags: ['Shopping'],
                summary: 'List shopping lists with items',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Shopping lists',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/ShoppingList' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/markets/markets': {
            get: {
                tags: ['Markets'],
                summary: 'Get all markets',
                responses: {
                    200: {
                        description: 'Markets',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Market' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/markets/markets/{id}': {
            get: {
                tags: ['Markets'],
                summary: 'Get market by id',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Market',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        { $ref: '#/components/schemas/Market' },
                                        {
                                            type: 'object',
                                            properties: {
                                                products: {
                                                    type: 'array',
                                                    items: { $ref: '#/components/schemas/MarketProduct' }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    404: { description: 'Market not found' }
                }
            }
        },
        '/api/v1/markets/markets/{id}/products': {
            get: {
                tags: ['Markets'],
                summary: 'Get products for a market',
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        required: true,
                        schema: { type: 'string' }
                    },
                    {
                        name: 'category',
                        in: 'query',
                        required: false,
                        schema: { type: 'string' }
                    }
                ],
                responses: {
                    200: {
                        description: 'Products list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/MarketProduct' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/markets/preferences': {
            post: {
                tags: ['Markets'],
                summary: 'Save market preference',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/MarketPreferenceInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Preference created',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MarketPreference' }
                            }
                        }
                    },
                    200: {
                        description: 'Preference updated',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/MarketPreference' }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/badges/badges': {
            get: {
                tags: ['Badges'],
                summary: 'Get all badges',
                responses: {
                    200: {
                        description: 'Badges list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Badge' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/badges/user/achievements': {
            get: {
                tags: ['Badges'],
                summary: 'Get user achievements',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: {
                        description: 'Achievements list',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/UserAchievement' }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/api/v1/badges/unlock': {
            post: {
                tags: ['Badges'],
                summary: 'Unlock badge for user',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/BadgeUnlockInput' }
                        }
                    }
                },
                responses: {
                    201: {
                        description: 'Badge unlocked',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/UserAchievement' }
                            }
                        }
                    },
                    400: { description: 'Already unlocked' },
                    404: { description: 'Badge not found' }
                }
            }
        }
    }
});
const createSwaggerSpec = () => (0, swagger_jsdoc_1.default)({
    definition: buildSwaggerDefinition(),
    apis: []
});
exports.swaggerSpec = createSwaggerSpec();
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(createSwaggerSpec(), { explorer: true }));
};
exports.setupSwagger = setupSwagger;
