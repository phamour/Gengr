"use strict";

(function() {
    var styles = [
        {
            selector: 'node',
            style: {
                'content': 'data(label)',
                'background-color': '#61bffc',
                'width': 25,
                'height': 25,
                'text-valign': 'center'
            }
        },
        {
            selector: 'edge',
            style: {
                'content': '',
                'target-arrow-shape': 'triangle',
                'width': 1,
                'line-color': '#000',
                'target-arrow-color': '#000'
            }
        },
        {
            selector: '.reversed_ok',
            style: {
                'content': '',
                'target-arrow-shape': 'triangle',
                'width': 1,
                'line-color': '#2ecc71',
                'target-arrow-color': '#2ecc71'
            }
        },
        {
            selector: '.reversed_more',
            style: {
                'content': '',
                'target-arrow-shape': 'triangle',
                'width': 3,
                'line-color': '#e74c3c',
                'target-arrow-color': '#e74c3c'
            }
        },
        {
            selector: '.reversed_less',
            style: {
                'content': '',
                'target-arrow-shape': 'triangle',
                'width': 3,
                'line-color': '#f1c40f',
                'target-arrow-color': '#f1c40f'
            }
        }
    ];

    $('#btndraw').on('click', function() {
        // Init graph
        var graph = {
            nodes: [],
            edges: []
        };

        // Auto generate vertices by number
        var nbv = $('#nbv').val() || 9;
        for (var i = 0; i < nbv; i++) {
            graph.nodes.push({
                data: {
                    id: 'v' + (i+1),
                    label: '' + (i+1)
                }
            });
        }

        // Parse arc list to fetch arcs
        var arcs = str2arcs($('#arcs').val());
        // Parse optimum solution arc list
        var optarcs = str2arcs($('#optarcs').val());
        // Parse original arc list
        var oarcs = str2arcs($('#oarcs').val());

        // Handle reversals
        if (optarcs.length > 0 && oarcs.length > 0) {
            arcs = handleReversals(arcs, optarcs, oarcs);
        }

        // Parse blockage list
        var blockages = str2arcs($('#blockages').val());

        // Remove blocked arcs from arcs array
        for (var i in blockages) {
            var b = blockages[i];
            arcs = arcs.filter(function(a) {
                return a.data.source !== b.data.source ||
                    a.data.target !== b.data.target;
            });
        }

        graph.edges = arcs;

        // Generate graph by Cytoscape.js
        cytoscape({
            container: $('#graph')[0],
            style: styles,
            elements: graph,
            layout: {
                name: 'grid',
                rows: Math.sqrt(nbv)
            }
        });
    });

    function str2arcs(str) {
        var arcs = [];

        var lines = str.split("\n") || [];
        for (var i in lines) {
            var tokens = lines[i].split(/\s+/);
            if (!tokens || tokens.length < 2) {
                continue;
            }
            arcs.push({
                data: {
                    id: 'a' + (i+1),
                    source: 'v' + tokens[0],
                    target: 'v' + tokens[1]
                }
            });
        }

        return arcs;
    }

    function handleReversals(solutionArcs, optimumArcs, originalArcs) {
        var isValid = optimumArcs && optimumArcs.length > 0 && 
            originalArcs && originalArcs.length > 0;

        if (isValid) {
            for (var i in solutionArcs) {
                var solutionA = solutionArcs[i].data;
                var optimumA = optimumArcs[i].data;
                var originalA = originalArcs[i].data;

                // Determine if arcs are reversed in solution and in optimal solution
                var isSolReversed = solutionA.source === originalA.target && 
                    solutionA.target === originalA.source;
                var isOptReversed = optimumA.source === originalA.target && 
                    optimumA.target === originalA.source;

                var classes = '';
                if (isSolReversed && isOptReversed) {
                    classes = 'reversed_ok';
                } else if (isSolReversed && !isOptReversed) {
                    classes = 'reversed_more';
                } else if (!isSolReversed && isOptReversed) {
                    classes = 'reversed_less';
                }
                solutionArcs[i]['classes'] = classes;
            }
        }

        return solutionArcs;
    }
})();
