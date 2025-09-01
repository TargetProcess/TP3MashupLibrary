tau.mashups
    .addDependency('tau/ui/templates/board.plus/boardplus.cell.axis.item.fn')
    .addMashup(function(fn) {
        fn.getMetricType = () => 'capacity'
    });