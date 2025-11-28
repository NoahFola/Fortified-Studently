"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Bell, Moon, Shield, User } from "lucide-react";

export default function SettingsPage() {
    const { darkMode, toggleDarkMode } = useUIStore();

    return (
        <div className="flex flex-col gap-6 max-w-4xl">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your application settings and preferences.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Moon className="h-5 w-5 text-primary" />
                        <CardTitle>Appearance</CardTitle>
                    </div>
                    <CardDescription>
                        Customize how the application looks on your device.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
                            <span>Dark Mode</span>
                            <span className="font-normal text-muted-foreground">
                                Switch between light and dark themes.
                            </span>
                        </Label>
                        <Switch id="dark-mode" checked={darkMode} onCheckedChange={toggleDarkMode} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>
                        Configure how you receive alerts and reminders.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="email-notifs" className="flex flex-col space-y-1">
                            <span>Email Notifications</span>
                            <span className="font-normal text-muted-foreground">
                                Receive daily summaries and important alerts via email.
                            </span>
                        </Label>
                        <Switch id="email-notifs" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="push-notifs" className="flex flex-col space-y-1">
                            <span>Push Notifications</span>
                            <span className="font-normal text-muted-foreground">
                                Receive real-time updates on your device.
                            </span>
                        </Label>
                        <Switch id="push-notifs" defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        <CardTitle>Privacy & Security</CardTitle>
                    </div>
                    <CardDescription>
                        Manage your data and security preferences.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium">Data Sharing</p>
                            <p className="text-sm text-muted-foreground">
                                Allow us to use your data to improve AI recommendations.
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <div className="flex justify-end">
                        <Button variant="destructive">Delete Account</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
