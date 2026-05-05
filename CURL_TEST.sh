#!/bin/bash
# ========================================
# SUPABASE API CURL TEST
# ========================================

SUPABASE_URL="https://yjzkkhbjtguwxgkyzmqo.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqemtraGJqdGd1d3hna3l6bXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3ODExMDQsImV4cCI6MjA5MzM1NzEwNH0.NGSjene9fDMOmYIQUNlq2209CtXbawiZeC0qrT99X84"

echo "🔍 Testing Supabase API Connection..."
echo "URL: $SUPABASE_URL"
echo "Key: ${SUPABASE_ANON_KEY:0:20}..."
echo ""

# Test 1: Basic connection
echo "1. Testing basic connection..."
response=$(curl -s -w "%{http_code}" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  "$SUPABASE_URL/rest/v1/articles?select=count" 2>/dev/null)

http_code="${response: -3}"
response_body="${response%???}"

if [ "$http_code" = "200" ] || [ "$http_code" = "406" ]; then
    echo "✅ Connection successful (HTTP $http_code)"
else
    echo "❌ Connection failed (HTTP $http_code)"
    echo "Response: $response_body"
fi

# Test 2: Check tables
echo ""
echo "2. Testing table access..."
tables=("articles" "contact_submissions" "tax_calculator_history" "site_content" "web_vitals")

for table in "${tables[@]}"; do
    response=$(curl -s -w "%{http_code}" \
      -H "apikey: $SUPABASE_ANON_KEY" \
      -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
      "$SUPABASE_URL/rest/v1/$table?select=count" 2>/dev/null)
    
    http_code="${response: -3}"
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "406" ]; then
        echo "✅ Table '$table': Access OK"
    else
        echo "❌ Table '$table': HTTP $http_code"
    fi
done

# Test 3: Authentication endpoint
echo ""
echo "3. Testing authentication endpoint..."
auth_response=$(curl -s -w "%{http_code}" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"jadtraconsulting@gmail.com","password":"Jadtra123!!"}' \
  "$SUPABASE_URL/auth/v1/token?grant_type=password" 2>/dev/null)

auth_http_code="${auth_response: -3}"
auth_body="${auth_response%???}"

if [ "$auth_http_code" = "200" ]; then
    echo "✅ Authentication successful"
    echo "Response: ${auth_body:0:100}..."
else
    echo "❌ Authentication failed (HTTP $auth_http_code)"
    echo "Response: $auth_body"
fi

echo ""
echo "📊 Test completed!"
