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

  if (event.httpMethod === 'DELETE') {
    try {
      const { date } = JSON.parse(event.body);
      
      if (!date) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '削除する日付が指定されていません' }),
        };
      }

      const { error } = await supabase
        .from('daily_data')
        .delete()
        .eq('date', date);

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'データが正常に削除されました' }),
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'データの削除に失敗しました' }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
