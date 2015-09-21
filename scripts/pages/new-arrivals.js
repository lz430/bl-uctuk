define(['modules/jquery-mozu'
    , "underscore"
    , 'hyprlive'
    , 'modules/backbone-mozu'
    , "modules/models-faceting"
    , "modules/views-productlists"
    , "modules/views-paging"
    , 'modules/bazaar-voice'
    , 'modules/api'
    , 'hyprlivecontext', 
    ], function ($, _, Hypr, Backbone, FacetingModels, ProductListViews, PagingViews, BazaarVoice, API, HyprLiveContext) {


    var comparators = {
        "price asc": function(m1, m2) {
            var price1 = m1.get('price.price'),
                price2 = m2.get('price.price');
            if (price1 > price2) return 1;
            if (price1 === price2) return 0;
            if (price1 < price2) return -1;
        },
        "price desc": function(m1, m2) {
            var price1 = m1.get('price.price'),
                price2 = m2.get('price.price');
            if (price1 < price2) return 1;
            if (price1 === price2) return 0;
            if (price1 > price2) return -1;
        }
    };

    var facetingViews = {}
        , useAnimatedLists = Hypr.getThemeSetting('useAnimatedProductLists') && !Modernizr.mq('(max-width: 480px)')
        , themeSettings = HyprLiveContext.locals.themeSettings
        , newArrivalsDate;


    var NewArrivalsCollection = FacetingModels.FacetedProductCollection.extend({
        sortBy: function(sortString) {
            this.get('items').comparator = comparators[sortString];
            return this.apiGet($.extend(this.lastRequest, { sortBy: sortString }));            
        }
    });

    //figure out how far back to look back based on the numberOfDaysNew
    newArrivalsDate = new Date(new Date().setDate(new Date().getDate() - themeSettings.numberOfDaysNew)).toISOString();

    //console.log("Number of Days New = " + themeSettings.numberOfDaysNew);
    //console.log("Looking back to date: " + newArrivalsDate);
    //console.log("Min number of New Arrivals = " + themeSettings.minNumberOfNewArrivals);
    //console.log("includeOutOfStock = " +themeSettings.includeOutOfStock);
    //if (themeSettings.numberOfDaysNew.length === 0 || themeSettings.minNumberOfNewArrivals.length === 0) { console.warn ("NO getThemeSetting");}

    $(document).ready(function () {

        var $searchPageBody = $('[data-mz-newarrivals]'),

            facetingModel = new NewArrivalsCollection({});

            facetingModel.baseRequestParams = facetingModel.lastRequest = {
                filter: "createDate gt " + newArrivalsDate,
                sortBy: 'createDate desc',
                pageSize: '3'
            };

            $.extend(facetingViews, {
                pagingControls: new PagingViews.PagingControls({
                    el: $searchPageBody.find('[data-mz-pagingcontrols]'),
                    model: facetingModel
                }),
                pageNumbers: new PagingViews.TopScrollingPageNumbers({
                    el: $searchPageBody.find('[data-mz-pagenumbers]'),
                    model: facetingModel
                }),
                pageSort: new PagingViews.PageSortView({
                    el: $searchPageBody.find('[data-mz-pagesort]'),
                    model: facetingModel
                }),
                productList: (useAnimatedLists ? new ProductListViews.AnimatedList({
                    el: $searchPageBody.find('[data-mz-productlist] .mz-productlist-list'),
                    model: facetingModel
                }) : new ProductListViews.List({
                    el: $searchPageBody.find('[data-mz-productlist]'),
                    model: facetingModel
                }))
            });

            Backbone.history.start({ pushState: true, root: window.location.pathname });
            var router = new Backbone.Router();

            var navigating = false;

            facetingModel.on('facetchange', function(q) {
                if (!navigating) {
                    router.navigate(q);
                }
                navigating = false;
            }, router);

            facetingModel.on('change:pageSize', facetingModel.updateFacets, facetingModel);


            var defaultPageSize = Hypr.getThemeSetting('defaultPageSize');
            
            // this  handle back and forward buttons
            router.route('*all', "filter", function() {
                var urlParams = $.extend({ pageSize: defaultPageSize }, $.deparam()),
                    options = {},
                    req = facetingModel.lastRequest;
                if (!urlParams.startIndex) options.resetIndex = true;
                facetingModel.set(_.pick(urlParams, 'pageSize', 'startIndex', 'facetValueFilter', 'sortBy', 'categoryId'), { silent: true });
                navigating = true;
                facetingModel.updateFacets(options);
            });

            _.invoke(facetingViews, 'delegateEvents');

            facetingModel.updateFacets();

            facetingModel.on('sync', function(data, lastIndex) {
                
                if ($('[data-mz-newarrivals]').prop("style").length === 0) $searchPageBody.noFlickerFadeIn();

                // do this only on the first page of products
                // TODO: this doesnt sound right!...what happens after this, on other pages...
                if (data.startIndex === 0) {

                    // see if there is a need to bring more products (if new arrivals are fewer than minimum required)                    
                    var extraProductsToGet = themeSettings.minNumberOfNewArrivals - (themeSettings.includeOutOfStock ? data.totalCount : numberInStock(data)),
                        // if we are supposed to show only products in stock, get X more products, since we dont know how many will be out of stock
                        pageSize = (themeSettings.includeOutOfStock ? extraProductsToGet : extraProductsToGet * 4);
                    
                    // first time the index equal 0, so initalize it to 0
                    if (typeof lastIndex !== "number") lastIndex = 0;
                    
                    // if we need more products
                    if (extraProductsToGet > 0) {
                        // issue another AJAX request
                        API.get('search', { 
                            // look for the most recent ones
                            sortBy: 'createDate desc'
                            // starting from the (ones we have already + where we looked so far)
                            // TODO: check if totalCount is correct or we "shrink" everytime
                            , startIndex: 0
                            // in a chunk of how many we need to get
                            , pageSize: themeSettings.minNumberOfNewArrivals
                        }).then(function(res) {
                            // get the out of stock out if needed
                            // TODO: do this only if "out of stock" need to be removed
                            var validProducts = filterForInStock(res.data.items);
                            // add what you got and filtered to the model
                            //facetingModel.get('items').add(validProducts);
                            facetingModel.get('items').add(validProducts);
                            // trigger the sync again, thus rechecking if the operation needs repeated 
                            facetingModel.trigger('sync', facetingModel.toJSON(), 0);

                            // hide the pagination controls as they are messed up now - TODO: this needs to be fixed
                            $searchPageBody.find('[data-mz-pagingcontrols]').hide();
                            $searchPageBody.find('[data-mz-pagenumbers]').hide();
                        });
                    }
                }
            });

            // Just like "on", but causes the bound callback to only fire once before being removed, since we neet this only first time
            // facetingModel.once('sync', function() {
            //     $searchPageBody.noFlickerFadeIn();
            // });


        BazaarVoice.productSummary('[data-mz-role="product-listing-review"]');

        window.facetingViews = facetingViews;

        return facetingViews;

    });

    // stub for function to get how many products are in stock in a product set
    function numberInStock(data) {
        return data.totalCount;
    }

    // stub for function to remove out of stock products from a product set
    function filterForInStock(data) {
        return data;
    }        
});