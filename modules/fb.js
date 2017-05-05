const FB = require('fb');
const request = require('request');

function getReactions(posts){
    return new Promise((resolve, reject) => {

        posts.map((data, index) => {
            FB.api(
                data.id+"/reactions",
                function (response) {
                    if (response && !response.error) {
                        data.reactions = response;

                        if(index == posts.length-1) {
                            resolve(posts)
                        }
                    }
                }
            );
        });
    })
}

function getPosts() {
    return new Promise((resolve, reject) => {
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

            FB.api('113878732017445/posts', function (res) {
                if(!res || res.error) {
                    console.log(!res ? 'error occurred' : res.error);
                    return;
                }
                getReactions(res.data).then(result => {
                    resolve(result);
                })

            });
        });
    });
}


module.exports = {
    getPosts,
    getReactions

};
