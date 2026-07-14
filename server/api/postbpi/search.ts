/**
 * @api {get} /api/postbpi/search Search posts with full-text search
 *
 * Example Request (Postman):
 * GET /api/postbpi/search?q=cloudflare&page=1&limit=10
 *
 * Query Parameters:
 * - q: Search query/keywords (required)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 *
 * Success Response (200):
 * {
 *   "statusCode": 200,
 *   "body": {
 *     "posts": [
 *       {
 *         "id": 1,
 *         "title": "Getting Started with Cloudflare Workers",
 *         "content": "Learn how to build serverless applications...",
 *         "category": "Technology",
 *         "status": "published",
 *         "author_id": 1,
 *         "created_at": "2023-01-01T00:00:00.000Z"
 *       }
 *     ],
 *     "pagination": {
 *       "total": 15,
 *       "page": 1,
 *       "limit": 10,
 *       "totalPages": 2
 *     }
 *   }
 * }
 *
 * Error Responses:
 * - 400: Missing search query
 * - 500: Server error
 */

export default defineEventHandler(async (event) => {
  try {
    // Get query parameters
    const query = getQuery(event)
    const searchQuery = query.q as string
    const page = Number(query.page) || 1
    const limit = Number(query.limit) || 10
    const offset = (page - 1) * limit

    // Validate search query
    if (!searchQuery || searchQuery.trim() === '') {
      throw createError({
        statusCode: 400,
        message: 'Search query is required'
      })
    }

    // Get D1 database instance
    const db = event.context.cloudflare.env.DB

    const likePattern = `%${searchQuery}%`

    // Get total count of matching published posts
    const totalResult = await db
      .prepare(`
        SELECT COUNT(*) as total 
        FROM posttb
        WHERE (title LIKE ? OR content LIKE ?) AND status = ?
      `)
      .bind(likePattern, likePattern, 'published')
      .first<{ total: number }>()
    
    const total = totalResult?.total || 0
    const totalPages = Math.ceil(total / limit)

    // Get paginated search results
    const posts = await db
      .prepare(`
        SELECT id, title, content, category, author_id, created_at, status 
        FROM posttb
        WHERE (title LIKE ? OR content LIKE ?) AND status = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `)
      .bind(likePattern, likePattern, 'published', limit, offset)
      .all<{ id: number; title: string; content: string; category: string | null; author_id: number; created_at: string; status: string }>()

    return {
      statusCode: 200,
      body: {
        posts: posts?.results || [],
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    console.error('Search posts error:', error)
    throw createError({
      statusCode: 500,
      message: 'An error occurred while searching posts'
    })
  }
})
