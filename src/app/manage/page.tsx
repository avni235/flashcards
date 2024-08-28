import prisma from "@/prisma";
import { CategoriesDataTable } from "./_categories/categories-data-table";
import { FlashcardsDataTable } from "./_flashcards/flashcards-data-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateCategory from "./_categories/create-category-dialog";
import CreateFlashcard from "./_flashcards/create-flashcard-dialog";

export default async function Manage() {
  let categories = [];
  let flashcards = [];

  try {
    categories = await prisma.category.findMany();
    flashcards = await prisma.flashcard.findMany({
      include: { category: true },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    // Optionally handle error or set fallback data
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <span className="font-bold text-3xl">Categories</span>
          <CreateCategory />
        </CardHeader>
        <CardContent>
          <CategoriesDataTable categories={categories} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <span className="font-bold text-3xl">Flashcards</span>
          <CreateFlashcard categories={categories} />
        </CardHeader>
        <CardContent>
          <FlashcardsDataTable
            flashcards={flashcards}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
