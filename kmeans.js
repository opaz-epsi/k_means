function KMeans(canvas, meansCount) {
    function initializeMeans() {
        var means = [];
        for (var i = 0; i < meansCount; i++) {
            var pixel = canvas.pixelAtIndex(i);
            means[i] = {
                color: pixel.color.clone(),
                closestPixels: []
            };
        }
        return means;
    }

    function findClosestMean(means, pixel) {
        var minDistance = Number.MAX_VALUE;
        var closestMean = null;
        _.each(means, function (mean) {
            var distance = mean.color.distanceFrom(pixel.color);
            if (distance < minDistance) {
                minDistance = distance;
                closestMean = mean;
            }
        });
        return closestMean;
    }

    function processClosestPixels(means) {
        for(var i = 0; i < meansCount; i++) {
            means[i].closestPixels = [];
        }

        canvas.forEachPixel(function(context, pixel) {
            var closestMean = findClosestMean(means, pixel);
            if(closestMean) {
                closestMean.closestPixels.push(pixel);
            }
        });
    }

    function averageColor(colorIndex, mean) {
        return _.chain(mean.closestPixels)
                .map(function (p) {
                    return p.color[colorIndex]
                })
                .reduce(function (sum, color) {
                    return sum + color;
                }, 0)
                .value() / mean.closestPixels.length;
    }

    function updateMeanColors(means) {
        _.each(means, function(mean) {
            if(mean.closestPixels.length > 0) {

                var averageR = averageColor('r', mean);
                var averageG = averageColor('g', mean);
                var averageB = averageColor('b', mean);

                mean.color = Color(averageR, averageG, averageB);
            }
        });
    }

    function updateMeans(means) {
        processClosestPixels(means);
        updateMeanColors(means);
    }

    function cloneMeanColors(means) {
        return _.map(means, function(mean) {
            return mean.color.clone();
        });
    }

    function colorEquals(colors1, colors2) {
        return _.chain(_.zip(colors1, colors2))
            .map(function(colors) {
                return colors[0].equals(colors[1]);
            })
            .reduce(function(result, value) {
                return result && value;
            }, true)
            .value();
    }

    function process() {
        var means = initializeMeans();
        var meanColors;
        do {
            meanColors = cloneMeanColors(means);
            updateMeans(means);
        } while (!colorEquals(meanColors, _.pluck(means, 'color')));

        means = means.filter(function (mean) {
            return mean.closestPixels.length > 0;
        });

        return means;
    }

    return {
        process: process
    }
}