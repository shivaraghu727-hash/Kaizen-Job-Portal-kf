// Test script to verify environment variables
console.log("🔍 Testing Environment Variables...\n")

console.log("NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing")
console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing")
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing")
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "✅ Set" : "❌ Missing")

console.log("\n📋 Values:")
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL || "Using fallback")
console.log("Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Present" : "Using fallback")
console.log("Service Key:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "Present" : "Using fallback")
console.log("OpenAI Key:", process.env.OPENAI_API_KEY ? "Present" : "Using fallback")
