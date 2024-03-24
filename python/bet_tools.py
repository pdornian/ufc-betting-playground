import pandas as pd 
import numpy as np 
from random import random

# semantics:
# a "strategy" is going to be a function that takes a dataframe and for each row, returns "RED", "BLUE", or "UNDECIDED"
# we could probably just encode this as something boolean instead, but this will be easier to read I think.

# all strategies will be decided by comparing a numeric 'statistic' from a red fighter to a blue fighter.
# for consistincy in handling,by default the LARGER number will ALWAYS be considered the "better" statistic. 

########PARAMETERS###################################################################
# by default, i'm going to define all boolean conditions relative to RED corner.
# e.g. if we're checking which name is longer, we'll do a boolean check on if red is longer.
# this let's use consistent maps from boolean conditions to selecting fighters across all selection functions.

bool_corner_map = {True: "Red", False: "Blue"}

# the above is for semantics mostly. also defining a prefix map from defined corner to the column prefix.
corner_to_prefix_map = {"Red": "r_", "Blue": "b_"}

# maps for converting a column of red/blue into 1's and 0's representing wins.
red_wins_map = {"Red": 1, "Blue": 0}
blue_wins_map = {"Blue": 1, "Red": 0}
######################################################3


# doing some weird shit here because i want practice making sure everything is vectorized and not splitting it into conditions
# MUST HAVE SERIES AS INPUT, otherwise map explodes. no numpy vectors, sorry.
# stats are interpreted as "bigger is better" by default.
# set invert_stat=True if you want to interpret a smaller stat as better.
def _compare_stats(r_stats, b_stats, invert_stat=False):
    # flip sign if minimizing
    if invert_stat:
        r_stats = -1 * r_stats
        b_stats = -1 * b_stats

    # this slams out "RED" whenever the red stat is strictly greater than the blue one and BLUE otherwise.
    output = (r_stats > b_stats).map(bool_corner_map)
    # but we also need to account for equality.
    # get those indices, and overight them with UNDECIDED
    equal_indices = output[r_stats == b_stats].index
    output.loc[equal_indices] = "UNDECIDED"
    return output

# default tiebreaker: coin flip
def _tiebreak_50_50(row):
    rand = random()
    corner = "Red" if rand > 0.5 else "Blue"
    return corner

def apply_strat(
    df, stat, invert_stat=False, apply_tiebreaker=True, tiebreaker=_tiebreak_50_50
):
    corner_favoured = _compare_stats(*stat(df), invert_stat)
    if apply_tiebreaker:
        corner_favoured.loc[corner_favoured == "UNDECIDED"] = corner_favoured.loc[
            corner_favoured == "UNDECIDED"
        ].map(tiebreaker)
    return corner_favoured


# apply a bet of one unit across all fights according to a fixed strategy. defaults to unit of $100
def bet_fixed_strat_fixed_unit(input_df, stat_func, invert_stat=False, unit=100):
    df = input_df.copy()
    df["strat_choice"] = apply_strat(df, stat_func, invert_stat)
    df["strat_win"] = df["winner"] == df["strat_choice"]
    # doing weird shit here with evs because now i don't want to write any if statements/conditions out of spite.
    # is this actually quicker than evaluating an if statement? not sure.
    df["return_gross"] = (
        (
            df["r_ev"] * df["winner"].map(red_wins_map)
            + df["b_ev"] * df["winner"].map(blue_wins_map)
            + 1
        )
        * df["strat_win"]
        * unit
    )
    df["return_net"] = df["return_gross"] - unit

    print(f"Net Return:${round(df['return_net'].sum(),2)}")

    return df


###############DEFINED STATS HERE########################
# invert for favourite
def _stat_underdog(df):
    r_stat = df["r_odds"]
    b_stat = df["b_odds"]
    return r_stat, b_stat


# invert for blue
def _stat_red(df):
    rowcount = df.shape[0]
    r_stat = pd.Series(np.ones(rowcount))
    b_stat = pd.Series(np.zeros(rowcount))
    return r_stat, b_stat


def _stat_height(df):
    r_stat = df["r_height_cms"]
    b_stat = df["b_height_cms"]
    return r_stat, b_stat


def _stat_reach(df):
    r_stat = df["r_reach_cms"]
    b_stat = df["b_reach_cms"]
    return r_stat, b_stat


def _stat_name_length(df):
    r_stat = df["r_fighter"].str.len()
    b_stat = df["b_fighter"].str.len()
    return r_stat, b_stat