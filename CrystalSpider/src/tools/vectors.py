import numpy as np
from scipy.signal import resample


def _resample_vector(vec, target_length):
    if len(vec) != target_length:
        vec = resample(vec, target_length)
    return vec


def _pad_vector(vec, target_length):
    if len(vec) < target_length:
        vec = np.pad(vec, (0, target_length - len(vec)), mode='constant', constant_values=0)
    return vec


def _truncate_vector(vec, target_length):
    if len(vec) > target_length:
        vec = vec[:target_length]
    return vec


class AdjustmentMode:
    RESAMPLE = 1
    PAD = 2
    TRUNCATE = 3,
    AUTO = 4


def adjust_vector(vec, target_length, adjustment=AdjustmentMode.AUTO):
    if len(vec) == target_length:
        return vec
    if adjustment == AdjustmentMode.AUTO:
        adjustment = AdjustmentMode.PAD if len(vec) < target_length else AdjustmentMode.RESAMPLE
    if adjustment == AdjustmentMode.RESAMPLE:
        return _resample_vector(vec, target_length)
    elif adjustment == AdjustmentMode.PAD:
        return _pad_vector(vec, target_length)
    elif adjustment == AdjustmentMode.TRUNCATE:
        return _truncate_vector(vec, target_length)
    else:
        raise ValueError("Invalid adjustment type")
