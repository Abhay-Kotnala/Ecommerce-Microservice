import { useState } from 'react';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Settings,
    TrendingUp,
    Users,
    DollarSign,
    Activity
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

// Mock Data for Chart
const chartData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
];

// Mock Data for Recent Orders
const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', product: 'Wireless Headphones', amount: '$149.99', status: 'Completed' },
    { id: 'ORD-002', customer: 'Alice Smith', product: 'Gaming Keyboard', amount: '$129.99', status: 'Processing' },
    { id: 'ORD-003', customer: 'Bob Johnson', product: '4K Monitor', amount: '$599.99', status: 'Completed' },
    { id: 'ORD-004', customer: 'Emma Wilson', product: 'USB-C Hub', amount: '$59.99', status: 'Shipped' },
    { id: 'ORD-005', customer: 'Michael Brown', product: 'Ergonomic Chair', amount: '$349.99', status: 'Processing' },
];

export default function Admin() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card hidden md:block">
                <div className="p-6">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Admin Panel
                    </h2>
                </div>
                <nav className="space-y-1 px-3">
                    <Button
                        variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                    <Button
                        variant={activeTab === 'products' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('products')}
                    >
                        <Package className="mr-2 h-4 w-4" />
                        Products
                    </Button>
                    <Button
                        variant={activeTab === 'orders' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('orders')}
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Orders
                    </Button>
                    <Button
                        variant={activeTab === 'customers' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('customers')}
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Customers
                    </Button>
                    <Button
                        variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground">Overview of your store's performance.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button>Download Report</Button>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹35,45,231</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                                <ShoppingCart className="h-4 w-4 text-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+2350</div>
                                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
                                <Package className="h-4 w-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12,234</div>
                                <p className="text-xs text-muted-foreground">+19% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                                <Activity className="h-4 w-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">+573</div>
                                <p className="text-xs text-muted-foreground">+201 since last hour</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts & Recent Orders */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                        {/* Chart */}
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Revenue Overview</CardTitle>
                                <CardDescription>Monthly revenue performance.</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                stroke="#888888"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                                tickFormatter={(value) => `₹${value}`}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '8px'
                                                }}
                                                formatter={(value) => [`₹${value}`, 'Revenue']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#f97316"
                                                strokeWidth={2}
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Orders Table */}
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>You have 265 orders this month.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">
                                                    {order.id}
                                                    <div className="text-xs text-muted-foreground">{order.customer}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${order.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                                                        order.status === 'Processing' ? 'bg-blue-500/20 text-blue-500' :
                                                            'bg-yellow-500/20 text-yellow-500'
                                                        }`}>
                                                        {order.status}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">{order.amount.replace('$', '₹').replace(/\.99/, '999')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
