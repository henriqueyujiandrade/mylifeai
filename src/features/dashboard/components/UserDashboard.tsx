import { AsyncBoundary, DataBoundary } from '@/shared/components/AsyncBoundary'
import { useAsyncData } from '@/shared/hooks/useAsyncData'
import { useMemo, startTransition, useOptimistic } from 'react'

interface User {
  id: string
  name: string
  email: string
  lastActive: Date
}

interface DashboardData {
  user: User
  stats: {
    totalPosts: number
    totalViews: number
    totalLikes: number
  }
}

/**
 * React 19 Enhanced Dashboard with Server Component patterns
 * Demonstrates proper data fetching, caching, and optimistic updates
 */
export function UserDashboard({ userId }: { userId: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold theme-text-primary">Dashboard</h1>
      
      {/* AsyncBoundary handles loading and error states automatically */}
      <AsyncBoundary>
        <DashboardContent userId={userId} />
      </AsyncBoundary>
    </div>
  )
}

/**
 * Server Component pattern: Data fetching component
 * This would be a Server Component in Next.js, but we simulate it in SPA
 */
function DashboardContent({ userId }: { userId: string }) {
  // React 19 `use` hook for cleaner async data fetching
  const dashboardData = useAsyncData(
    () => fetchDashboardData(userId),
    [userId]
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UserCard user={dashboardData.user} />
      <StatsCard stats={dashboardData.stats} />
      <ActivityFeed userId={userId} />
      <QuickActions userId={userId} />
    </div>
  )
}

/**
 * Client Component: Interactive user card with optimistic updates
 */
function UserCard({ user }: { user: User }) {
  const [optimisticUser, setOptimisticUser] = useOptimistic(
    user,
    (state, newName: string) => ({ ...state, name: newName })
  )

  const handleNameUpdate = async (newName: string) => {
    startTransition(() => {
      setOptimisticUser(newName)
    })
    
    try {
      await updateUserName(user.id, newName)
    } catch (error) {
      // Revert optimistic update on error
      console.error('Failed to update name:', error)
    }
  }

  return (
    <div className="theme-bg-surface p-6 rounded-lg theme-shadow-sm">
      <h2 className="text-lg font-semibold theme-text-primary mb-4">Profile</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium theme-text-secondary">Name</label>
          <input
            type="text"
            value={optimisticUser.name}
            onChange={(e) => handleNameUpdate(e.target.value)}
            className="mt-1 block w-full rounded-md theme-border border theme-bg-surface px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium theme-text-secondary">Email</label>
          <p className="mt-1 text-sm theme-text-primary">{user.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium theme-text-secondary">Last Active</label>
          <p className="mt-1 text-sm theme-text-muted">
            {user.lastActive.toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Server Component pattern: Stats display (read-only data)
 */
function StatsCard({ stats }: { stats: DashboardData['stats'] }) {
  const formattedStats = useMemo(() => [
    { label: 'Posts', value: stats.totalPosts.toLocaleString() },
    { label: 'Views', value: stats.totalViews.toLocaleString() },
    { label: 'Likes', value: stats.totalLikes.toLocaleString() },
  ], [stats])

  return (
    <div className="theme-bg-surface p-6 rounded-lg theme-shadow-sm">
      <h2 className="text-lg font-semibold theme-text-primary mb-4">Statistics</h2>
      <div className="grid grid-cols-3 gap-4">
        {formattedStats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-2xl font-bold theme-text-primary">{stat.value}</div>
            <div className="text-sm theme-text-secondary">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Nested AsyncBoundary for independent data loading
 */
function ActivityFeed({ userId }: { userId: string }) {
  return (
    <div className="theme-bg-surface p-6 rounded-lg theme-shadow-sm">
      <h2 className="text-lg font-semibold theme-text-primary mb-4">Recent Activity</h2>
      <DataBoundary loadingMessage="Loading activity...">
        <ActivityList userId={userId} />
      </DataBoundary>
    </div>
  )
}

function ActivityList({ userId }: { userId: string }) {
  const activities = useAsyncData(
    () => fetchUserActivities(),
    [userId]
  )

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="flex-1">
            <p className="text-sm theme-text-primary">{activity.description}</p>
            <p className="text-xs theme-text-muted">{activity.timestamp}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Client Component: Interactive actions
 */
function QuickActions({ userId }: { userId: string }) {
  const handleAction = async (action: string) => {
    startTransition(async () => {
      await performUserAction(userId, action)
    })
  }

  return (
    <div className="theme-bg-surface p-6 rounded-lg theme-shadow-sm">
      <h2 className="text-lg font-semibold theme-text-primary mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <button
          onClick={() => handleAction('refresh')}
          className="w-full theme-button-secondary px-4 py-2 rounded-md text-sm"
        >
          Refresh Data
        </button>
        <button
          onClick={() => handleAction('export')}
          className="w-full theme-button-secondary px-4 py-2 rounded-md text-sm"
        >
          Export Data
        </button>
      </div>
    </div>
  )
}

// Mock API functions (replace with real API calls)
async function fetchDashboardData(userId: string): Promise<DashboardData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  return {
    user: {
      id: userId,
      name: 'John Doe',
      email: 'john@example.com',
      lastActive: new Date(),
    },
    stats: {
      totalPosts: 42,
      totalViews: 1337,
      totalLikes: 256,
    },
  }
}

async function fetchUserActivities() {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return [
    { id: '1', description: 'Created new post', timestamp: '2 hours ago' },
    { id: '2', description: 'Updated profile', timestamp: '1 day ago' },
    { id: '3', description: 'Liked 5 posts', timestamp: '2 days ago' },
  ]
}

async function updateUserName(userId: string, name: string) {
  await new Promise(resolve => setTimeout(resolve, 300))
  console.log(`Updated user ${userId} name to ${name}`)
}

async function performUserAction(userId: string, action: string) {
  await new Promise(resolve => setTimeout(resolve, 500))
  console.log(`Performed ${action} for user ${userId}`)
}