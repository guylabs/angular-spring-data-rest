/**
 * @module spring-data-rest
 * @version <%= pkg.version %>
 *
 * Provider for the interceptor which wraps the SpringDataRestAdapter around the response object.
 */
angular.module("spring-data-rest").provider("SpringDataRestInterceptor",
    ["$httpProvider", "SpringDataRestAdapterProvider",
        function ($httpProvider) {
            return {

                apply: function () {
                    $httpProvider.interceptors.push("SpringDataRestInterceptor");
                },

                $get: ["SpringDataRestAdapter", "$q", function (SpringDataRestAdapter, $q) {

                    return {
                        response: function (response) {
                            if (!angular.isObject(response.data) || response.data instanceof Array){
                                return response;
                            }
                            return SpringDataRestAdapter.process(response.data).then(function (processedResponse) {
                                response.data = processedResponse;
                                return response;
                            });
                        }
                    };
                }]

            };

        }]
);
