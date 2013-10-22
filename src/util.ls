# Utility functions.
#

# Make an accessor/mutator function for the specified member variable.
#
exports.makeProp = (name, fn) ->
    (it) ->
        return this[name] unless it?
        this[name] = it
        fn(it) if fn?
        this
