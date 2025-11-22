import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Drink, DrinkCategory } from '@/models/drink';

export const dynamic = 'force-dynamic';

// GET - Récupérer toutes les boissons actives groupées par catégorie
export async function GET() {
  try {
    await connectDB();

    const categories = await DrinkCategory.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    const drinks = await Drink.find({ isActive: true })
      .populate('category', 'name slug')
      .sort({ order: 1 })
      .lean();

    // Grouper les boissons par catégorie
    const menu = categories.map(category => ({
      _id: category._id,
      name: category.name,
      slug: category.slug,
      drinks: drinks.filter(
        (drink: any) => drink.category?._id?.toString() === category._id.toString()
      )
    }));

    return NextResponse.json({ menu }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération du menu:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
