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

export default function CounterHome({ type = 1 }: { type?: number }) {
    const [count, setCount] = useState<number>(0);
    const [targetCount, setTargetCount] = useState<number>(0);

    useEffect(() => {
        const url = type ? `/api/books/count?type=${type}` : `/api/books/count`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setTargetCount(data.count);
            })
            .catch((err) => console.error("Erro ao buscar contagem de livros:", err));
    }, [type]);

    // Animação de contagem
    // A cada 30ms, incrementa o contador até atingir o valor alvo
    useEffect(() => {
        if (targetCount === 0) return;

        let current = 0;
        const duration = 1000; // duração total da animação em ms
        const steps = 30; // número de incrementos
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
                <div className="flex items-center gap-2">
                    <BookOpen className="w-6 h-4 text-green-600" />
                    <CardTitle className="text-green-600 ">Livros</CardTitle>
                </div>
                <CardDescription>Nossa base de dados está sempre crescendo.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-bold text-green-700 text-center">{count}</p>
                <p className="text-sm text-gray-600 mt-2">Livros disponíveis no sistema</p>
            </CardContent>
            
        </Card>
    );
}
