const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod === 'GET') {
    try {
      const { data, error } = await supabase
        .from('daily_data')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data || []),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'データの取得に失敗しました' }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
