# Mock Data Summary

## Schema Overview

### sessions.json
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| user_id | string | User reference |
| project_id | string | Repository/project reference |
| start | string | ISO timestamp |
| finish | string | ISO timestamp |
| splices | string[] | Array of slice ids |

### slices.json
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| session_id | string | Session reference |
| languages | string[] | Programming languages used |
| files | string[] | File paths or ids |
| start | string | ISO timestamp |
| finish | string | ISO timestamp |
| actions | string[] | Actions (edit, run, compile, etc.) |

### files.json (optional)
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| slice_id | string | Slice reference |
| filename | string | File name |
| path | string | Full path |
| size | number | File size in bytes |

### repositories.json
| Field | Type | Description |
|-------|------|-------------|
| id | string | Matches project_id in sessions |
| title | string | Display name |
| description | string | Description |
| visibility | string | public, private, internal |

### users.json
| Field | Type | Description |
|-------|------|-------------|
| id | string | Matches user_id in sessions |
| name | string | Display name |

---

## Statistics Output Format

The `computeRepositoryStats()` function returns:

```json
{
  "projectId": "proj-customer-portal",
  "filters": { "dateFrom": null, "dateTo": null, "userId": null },
  "sortBy": "duration",
  "sortOrder": "desc",
  "userStats": [
    {
      "userId": "user-alice",
      "userName": "Alice",
      "totalSessions": 3,
      "totalDurationSeconds": 28800,
      "totalDurationFormatted": "8h 0m",
      "avgSlicesPerSession": 2.7,
      "topLanguages": [{"language": "TypeScript", "count": 12}],
      "topFiles": [{"path": "src/app/page.tsx", "count": 8}]
    }
  ],
  "aggregate": {
    "totalSessions": 6,
    "totalDurationSeconds": 50400,
    "mostUsedLanguages": [{"language": "TypeScript", "count": 25}],
    "mostUsedFiles": [{"path": "src/app/page.tsx", "count": 15}]
  },
  "sessionsWithSlices": [
    {
      "sessionId": "sess-001",
      "userId": "user-alice",
      "userName": "Alice",
      "start": "2026-03-01T09:00:00Z",
      "finish": "2026-03-01T12:30:00Z",
      "durationSeconds": 12600,
      "sliceCount": 3
    }
  ]
}
```
