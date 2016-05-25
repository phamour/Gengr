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
            selector: '.reversed',
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
        // Parse original arc list
        var oarcs = str2arcs($('#oarcs').val());

        // Handle reversals
        arcs = handleReversals(arcs, oarcs);

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

    function handleReversals(solutionArcs, originalArcs) {
        if (originalArcs && originalArcs.length > 0) {
            for (var i in solutionArcs) {
                var solutionA = solutionArcs[i].data;
                var originalA = originalArcs[i].data;
                if (solutionA.source === originalA.target && 
                    solutionA.target === originalA.source) {
                    solutionArcs[i]['classes'] = 'reversed';
                }
            }
        }
        return solutionArcs;
    }
})();
