import React from "react";
import { useGame } from "./GameContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from "@/components/ui";

function ClueList() {
    const { state, dispatch } = useGame();

    // Group words by category
    const categories = new Map<string, { across: typeof state.words, down: typeof state.words }>();

    state.words.forEach(word => {
        const category = word.category || 'General';
        if (!categories.has(category)) {
            categories.set(category, { across: [], down: [] });
        }

        const categoryWords = categories.get(category)!;
        if (word.direction === 'across') {
            categoryWords.across.push(word);
        } else {
            categoryWords.down.push(word);
        }
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Clues</CardTitle>
                <CardDescription>
                    {state.completedWords.length} of {state.words.length} words solved
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="across">
                    <TabsList className="w-full">
                        <TabsTrigger value="across">Across</TabsTrigger>
                        <TabsTrigger value="down">Down</TabsTrigger>
                        <TabsTrigger value="categories">Categories</TabsTrigger>
                    </TabsList>
                    <TabsContent value="across" className="mt-4">
                        <ul className="space-y-2">
                            {state.words
                                .filter(word => word.direction === 'across')
                                .map(word => {
                                    const isCompleted = state.completedWords.includes(word.id);
                                    const isActive = state.currentWordId === word.id;

                                    return (
                                        <li
                                            key={`clue-across-${word.id}`}
                                            className={`
                                                p-2 rounded-md cursor-pointer
                                                ${isCompleted ? 'text-green-600 dark:text-green-400 line-through' : ''}
                                                ${isActive ? 'bg-primary/10' : 'hover:bg-muted'}
                                            `}
                                            onClick={() => dispatch({ type: 'SET_WORD', wordId: word.id })}
                                        >
                                            <span className="font-semibold">{word.startRow + 1}.</span> {word.clue}
                                            {word.difficulty && (
                                                <Badge variant={
                                                    word.difficulty === 'easy' ? 'outline' :
                                                        word.difficulty === 'medium' ? 'secondary' : 'destructive'
                                                } className="ml-2 text-xs">
                                                    {word.difficulty}
                                                </Badge>
                                            )}
                                        </li>
                                    );
                                })}
                        </ul>
                    </TabsContent>
                    <TabsContent value="down" className="mt-4">
                        <ul className="space-y-2">
                            {state.words
                                .filter(word => word.direction === 'down')
                                .map(word => {
                                    const isCompleted = state.completedWords.includes(word.id);
                                    const isActive = state.currentWordId === word.id;

                                    return (
                                        <li
                                            key={`clue-down-${word.id}`}
                                            className={`
                                                p-2 rounded-md cursor-pointer
                                                ${isCompleted ? 'text-green-600 dark:text-green-400 line-through' : ''}
                                                ${isActive ? 'bg-primary/10' : 'hover:bg-muted'}
                                            `}
                                            onClick={() => dispatch({ type: 'SET_WORD', wordId: word.id })}
                                        >
                                            <span className="font-semibold">{word.startCol + 1}.</span> {word.clue}
                                            {word.difficulty && (
                                                <Badge variant={
                                                    word.difficulty === 'easy' ? 'outline' :
                                                        word.difficulty === 'medium' ? 'secondary' : 'destructive'
                                                } className="ml-2 text-xs">
                                                    {word.difficulty}
                                                </Badge>
                                            )}
                                        </li>
                                    );
                                })}
                        </ul>
                    </TabsContent>
                    <TabsContent value="categories" className="mt-4">
                        {Array.from(categories.entries()).map(([category, words]) => (
                            <div key={category} className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">{category}</h3>
                                <div className="space-y-4">
                                    {words.across.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Across</h4>
                                            <ul className="space-y-1">
                                                {words.across.map(word => {
                                                    const isCompleted = state.completedWords.includes(word.id);
                                                    return (
                                                        <li
                                                            key={`cat-across-${word.id}`}
                                                            className={`
                                                                p-1.5 rounded text-sm cursor-pointer hover:bg-muted
                                                                ${isCompleted ? 'text-green-600 dark:text-green-400 line-through' : ''}
                                                            `}
                                                            onClick={() => dispatch({ type: 'SET_WORD', wordId: word.id })}
                                                        >
                                                            {word.clue}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                    {words.down.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Down</h4>
                                            <ul className="space-y-1">
                                                {words.down.map(word => {
                                                    const isCompleted = state.completedWords.includes(word.id);
                                                    return (
                                                        <li
                                                            key={`cat-down-${word.id}`}
                                                            className={`
                                                                p-1.5 rounded text-sm cursor-pointer hover:bg-muted
                                                                ${isCompleted ? 'text-green-600 dark:text-green-400 line-through' : ''}
                                                            `}
                                                            onClick={() => dispatch({ type: 'SET_WORD', wordId: word.id })}
                                                        >
                                                            {word.clue}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </TabsContent>
                </Tabs>
            </CardContent>
            <CardFooter>
                <div className="text-sm text-muted-foreground">
                    Click on a clue to select the corresponding word
                </div>
            </CardFooter>
        </Card>
    );
}

export { ClueList }; 