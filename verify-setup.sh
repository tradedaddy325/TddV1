#!/usr/bin/env bash
# Neural Engine Complete - Build Verification Script

echo "🧠 Neural Engine Complete - Build Verification"
echo "==============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this from project root."
    exit 1
fi

echo "✅ Project root verified"
echo ""

# Check for created files
echo "📁 Checking created files..."
files=(
    "app/neural-engine-complete/page.tsx"
    "components/NeuralEngine/TechnicalAnalysisTab.tsx"
    "components/NeuralEngine/PsychologyTab.tsx"
    "components/NeuralEngine/SignalsTab.tsx"
    "components/NeuralEngine/PredictiveMarketsTab.tsx"
    "lib/hooks/useNeuralEngineData.ts"
    "lib/hooks/useFeatureAccess.ts"
    "types/neural-engine.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file"
    else
        echo "  ❌ $file (MISSING)"
    fi
done

echo ""
echo "📚 Checking documentation files..."
docs=(
    "START_HERE.md"
    "SETUP_SUMMARY.md"
    "NEURAL_ENGINE_README.md"
    "FILE_MANIFEST.md"
)

for doc in "${docs[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $doc"
    else
        echo "  ❌ $doc (MISSING)"
    fi
done

echo ""
echo "📦 Checking dependencies..."
if grep -q '"@supabase/supabase-js"' package.json; then
    echo "  ✅ Supabase installed"
else
    echo "  ⚠️  Supabase not found"
fi

if grep -q '"tailwindcss"' package.json; then
    echo "  ✅ Tailwind CSS installed"
else
    echo "  ⚠️  Tailwind CSS not found"
fi

if grep -q '"lucide-react"' package.json; then
    echo "  ✅ Lucide React installed"
else
    echo "  ⚠️  Lucide React not found"
fi

echo ""
echo "🎯 Next steps:"
echo "  1. npm install        # Install any missing dependencies"
echo "  2. npm run dev        # Start development server"
echo "  3. npm run build      # Build for production"
echo "  4. npm run lint       # Check for errors"
echo ""
echo "🚀 Ready to go!"
