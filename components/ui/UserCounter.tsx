"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function UserCounter() {
    const [count, setCount] = useState<number>(0);
    const [targetCount, setTargetCount] = useState<number>(0);

    useEffect(() => {
        fetch("/api/user/count")
            .then((res) => res.json())
            .then((data) => {
                setTargetCount(data.count);
            })
            .catch((err) => console.error("Erro ao buscar contagem de estudantes:", err));
    }, []);

    useEffect(() => {
        if (targetCount === 0) return;

        let current = 0;
        const duration = 1000;
        const steps = 30;
        const increment = targetCount / steps;
        const intervalTime = duration / steps;

        const interval = setInterval(() => {
            current += increment;
            if (current >= targetCount) {
                current = targetCount;
                clearInterval(interval);
            }
            setCount(Math.floor(current));
        }, intervalTime);

        return () => clearInterval(interval);
    }, [targetCount]);

    return (
        <Card className="mb-5">
            <CardHeader className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-2 text-center">
                    <BookOpen className="w-6 h-6 text-green-600" />
                    <CardTitle className="text-green-600 ">Usuários</CardTitle>
                </div>
                

                <CardDescription>
                    A comunidade cresce a cada dia. Junte-se a essa história!
                   
                </CardDescription>

            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold text-green-700 text-center">{count}</p>
                <p className="text-sm text-gray-600 mt-2">
                    Mentes brilhantes já conectadas
                </p>
            </CardContent>
           
        </Card>
    );
}
