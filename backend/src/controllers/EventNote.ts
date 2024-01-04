import crypto from "crypto";
import {UUID} from "crypto";

export class EventNote {
    private _id: UUID;
    private _name: string;
    private _timestamp: string;
    private _content: string = "";

    public constructor(name: string, timestamp: string, id: UUID | undefined = undefined) {
        this._name = name;
        this._timestamp = timestamp;
        this._id = id || crypto.randomUUID();
    }

    public get id(): UUID {
        return this._id;
    }

    public get name(): string {
        return this._name;
    }

    public get timestamp(): string {
        return this._timestamp;
    }

    public get content(): string {
        return this._content;
    }
}