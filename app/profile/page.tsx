"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Calendar, Edit } from "lucide-react";

export default function ProfilePage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your personal information and preferences.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                <Card>
                    <CardContent className="flex flex-col items-center gap-4 pt-6">
                        <Avatar className="h-32 w-32">
                            <AvatarImage src="/avatars/shadcn.jpg" alt="@shadcn" />
                            <AvatarFallback className="text-4xl">S</AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                            <h2 className="text-xl font-bold">Student Name</h2>
                            <p className="text-sm text-muted-foreground">Computer Science Major</p>
                        </div>
                        <div className="flex gap-2">
                            <Badge variant="secondary">Student</Badge>
                            <Badge variant="outline">Pro Plan</Badge>
                        </div>
                        <Button className="w-full" variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-1">
                            <span className="text-sm font-medium text-muted-foreground">Full Name</span>
                            <span className="text-base">Student Name</span>
                        </div>
                        <div className="grid gap-1">
                            <span className="text-sm font-medium text-muted-foreground">Email</span>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-base">student@example.com</span>
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <span className="text-sm font-medium text-muted-foreground">Location</span>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-base">New York, USA</span>
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <span className="text-sm font-medium text-muted-foreground">Joined</span>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-base">September 2023</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
