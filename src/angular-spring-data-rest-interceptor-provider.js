/**
 * @module spring-data-rest
 * @version 0.1.0
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
                            if (response && angular.isObject(response.data)) {
                                response.data = new SpringDataRestAdapter(response.data);
                            }
                            return response || $q.when(response);
                        }
                    };
                }]

            };

        }]
);
