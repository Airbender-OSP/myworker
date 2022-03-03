//let value = await MY_KV.get('cloud_kv');

// GET Request

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */

async function handleRequest(request) {
  console.log('method', request.method);
  if (request.method === 'POST'){
    //carry out whatever post logic we want
    const req = await request.json();
    console.log(`this is our req`, req)
    const { key, value } = req;
    console.log('key', key);
    await cloud_kv.put(key, value);
    return new Response('successfully added', {status: 200});
    // GET request, receives all values of KV store
  } else if (request.method === 'GET') {
    // const req = await request.json();
    // const { key, value } = req;
    // console.log('key', key);

    const allKeys = await cloud_kv.list();
    console.log('allKeys', allKeys);

    const keysRes = allKeys.keys;
    console.log('keysRes 0', keysRes[0]);

    //const keysArr = await keysRes.json();
    const values = [];
    for (let i = 0; i < keysRes.length; i += 1) {
      // use the obj.name as a key and then find the value
      let objInKV = keysRes[i];
      console.log(`object name`, objInKV.name);
      const kvValue = await cloud_kv.get(objInKV.name);
      values.push(kvValue);
      
    }
    console.log(`these are our kbValues`, values);
    // const val = await cloud_kv.get(key);
    // console.log(val);

    return new Response(JSON.stringify(values), {
      headers: { 'content-type': 'text/plain' },
    })
  } 
  else {
    const error = new Response('error adding', {status: 500});
    console.log('error', error);
    // console.log(`this is the type of error`, error.type)
    // console.log(`this is the url of error`, error.url)
    console.log(`this is the error status`, error.status);
    return error;
  }
}



// // POST Request
// const someHost = 'my-worker.airbenderosp7770.workers.dev';
// const url = someHost + '/requests/json';
// const body = {
//   results: ['default data to send'],
//   errors: null,
//   msg: 'I sent this to the fetch',
// };

// async function gatherResponse(response) {
//   const { headers } = response;
//   const contentType = headers.get('content-type') || '';
//   if (contentType.includes('application/json')) {
//     return JSON.stringify(await response.json());
//   } else if (contentType.includes('application/text')) {
//     return response.text();
//   } else if (contentType.includes('text/html')) {
//     return response.text();
//   } else {
//     return response.text();
//   }
// }

// async function handleRequest() {
//   const init = {
//     body: JSON.stringify(body),
//     method: 'POST',
//     headers: {
//       'content-type': 'application/json;charset=UTF-8',
//     },
//   };
//   const response = await fetch(url, init);
//   const results = await gatherResponse(response);
//   return new Response(results, init);
// }

// addEventListener('fetch', event => {
//   return event.respondWith(handleRequest());
// });


//Workers KV is a global, low-latency, key-value data store.
