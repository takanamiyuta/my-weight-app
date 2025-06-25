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
      const { index } = JSON.parse(event.body);
      
      if (index === undefined) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '削除するデータのインデックスが指定されていません' }),
        };
      }

      const { data: allData, error: fetchError } = await supabase
        .from('training_data')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      if (!allData || index >= allData.length) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '指定されたデータが見つかりません' }),
        };
      }

      const targetData = allData[index];
      
      const { error } = await supabase
        .from('training_data')
        .delete()
        .eq('id', targetData.id);

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
