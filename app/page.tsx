'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from 'react'
import BarCharts from "@/components/barChart";
import { ChartData } from "@/components/chartData";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, ListOrdered } from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
    return (
        <div className="grid grid-cols-2 gap-4 mt-20">
            <Card>
                <BarCharts />
            </Card>
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-6 h-6 text-yellow-500" />
                        <CardTitle>Commandes en attente</CardTitle>
                    </div>
                    <Link href="/gestion-order">
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <ListOrdered className="w-4 h-4" />
                            <span>Voir</span>
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">50 commandes en attente</p>
                    <p className="text-sm text-gray-500">15 urgentes • 20 en cours de validation • 15 en préparation</p>
                    <Progress value={50} className="mt-3" />
                </CardContent>
            </Card>
            <Card>
                <ChartData />
            </Card>
        </div>
    );
};

export default Dashboard;
