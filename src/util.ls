# Utility functions.
#

# Make an accessor/mutator function for the specified member variable.
#
exports.makeProp = (name, fn) ->
    (it) ->
        if it? then this[name] = it else this[name]
        fn(it) if fn?
        this
