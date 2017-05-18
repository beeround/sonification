const FB = require('fb');
const request = require('request');


function searchUser(query) {

    return new Promise((resolve, reject) => {
        FB.api('oauth/access_token', {
            client_id: '133078730567202',
            client_secret: '232468909d66ee6bd9a58ee5f07179ce',
            grant_type: 'client_credentials'
        }, function (res) {
            if (!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }

            FB.setAccessToken(res.access_token);

            FB.api('/search?q='+query+'&type=page&fields=picture,name,description,category,fan_count', function (res) {
                if(!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                }
                resolve(res)
            });
        })
    });

}

function getPosts(id, start, end) {
    return new Promise((resolve, reject) => {

        const pageId = id;

        FB.api('oauth/access_token', {
            client_id: '133078730567202',
            client_secret: '232468909d66ee6bd9a58ee5f07179ce',
            grant_type: 'client_credentials'
        }, function (res) {
            if(!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
            }

            FB.setAccessToken(res.access_token);

            FB.api(pageId+'/posts?fields=from,picture,full_picture,message,reactions.type(LIKE).summary(total_count).as(like),reactions.type(LOVE).summary(true).as(love),reactions.type(HAHA).summary(total_count).as(haha),reactions.type(SAD).summary(total_count).as(sad),reactions.type(ANGRY).summary(total_count).as(angry),reactions.type(WOW).summary(total_count).as(wow),permalink_url,created_time&since='+start+'&until='+end, function (res) {
                if(!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                }
                resolve(res.data);

            });
        });
    });
}


module.exports = {
    getPosts,
    searchUser

};
