const FB = require('fb');
const request = require('request');
const moment = require('moment');



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

function getPosts(id, start, end, limit) {
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

            FB.api(pageId+'/posts?limit='+limit+'&fields=from{name, link, fan_count, picture},picture,full_picture,message,reactions.type(LOVE).limit(0).summary(true).as(love),reactions.type(HAHA).limit(0).summary(total_count).as(haha),reactions.type(SAD).limit(0).summary(total_count).as(sad),reactions.type(ANGRY).limit(0).summary(total_count).as(angry),reactions.type(WOW).limit(0).summary(total_count).as(wow),permalink_url,created_time&since='+start+'&until='+end, function (res) {
                if(!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                }
                resolve(res.data);

            });
        });
    });
}

function getFavData(id) {
    return new Promise((resolve, reject) => {

        const pageId = id;
        const start = moment().format("DD.MM.YYYY") ;
        const end = moment().subtract(6,'days').format("DD.MM.YYYY");

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

            FB.api(pageId+'?fields=name,link,fan_count,picture{url},posts.limit(50){message,reactions.type(LOVE).limit(0).summary(true).as(love),reactions.type(HAHA).limit(0).summary(total_count).as(haha),reactions.type(SAD).limit(0).summary(total_count).as(sad),reactions.type(ANGRY).limit(0).summary(total_count).as(angry),reactions.type(WOW).limit(0).summary(total_count).as(wow),created_time}', function (res) {
                //
                console.log(res);
                if(!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                }
                resolve(res);

            });
        });
    });
}

module.exports = {
    getPosts,
    searchUser,
    getFavData

};
