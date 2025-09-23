import { PushCompareUrlVariable } from "./compare-url";
import { PushFilesAddedVariable } from "./files-added";
import { PushFilesModifiedVariable } from "./files-modified";
import { PushFilesRemovedVariable } from "./files-removed";
import { PushMessageVariable } from "./message";
import { PushNewCommitVariable } from "./new-commit";
import { PushPreviousCommitVariable } from "./previous-commit";
import { PushRefVariable } from "./ref";
import { PushWasForcedVariable } from "./was-forced";

export const PushVariables = [
    PushCompareUrlVariable,
    PushFilesAddedVariable,
    PushFilesModifiedVariable,
    PushFilesRemovedVariable,
    PushMessageVariable,
    PushNewCommitVariable,
    PushPreviousCommitVariable,
    PushRefVariable,
    PushWasForcedVariable
]