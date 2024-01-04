import {EventNote} from "./EventNote";
import {UUID} from "crypto";

const fs = require('fs');
const path = require('path');

export class EntryPersistenceManager {
    private _notesDirectory = __dirname + "/../../notes";

    public writeAllEvents(events: EventNote[]): void {
        this._clearDisk();
        events.forEach(event => this.writeEntry(event))
    }

    public writeEntry(event: EventNote): void {
        const fileName = event.id.toString();
        const filePath = path.join(this._notesDirectory, fileName);
        let metadata: string = `//NAME: ${event.name}\n`;
        metadata += `//DATE: ${event.timestamp}\n`;

        fs.writeFileSync(filePath, metadata);
    }

    public async readEvents(): Promise<EventNote[]> {
        const events: EventNote[] = [];
        const files = await fs.promises.readdir(this._notesDirectory);

        for (const file of files) {
            const filePath = path.join(this._notesDirectory, file);
            const content: string = fs.readFileSync(filePath, "utf8");

            const lines: string[] = content.split('\n');

            let name = '';
            let date = '';

            lines.forEach(line => {
                if (line.startsWith('//NAME:')) {
                    name = line.replace('//NAME:', '').trim();
                } else if (line.startsWith('//DATE:')) {
                    date = line.replace('//DATE:', '').trim();
                }
            });

            events.push(new EventNote(name, date, file as UUID));
        }

        return events;
    }

    private _clearDisk(): void {
        fs.readdir(this._notesDirectory, (err: any, files: any[]) => {
            if (err) {
                console.error('Error reading the directory', err);
                return;
            }

            files.forEach(file => {
                const filePath = path.join(this._notesDirectory, file);
                fs.unlink(filePath, (err: any) => {
                    if (err) {
                        console.error('Error deleting file', filePath, err);
                    } else {
                        console.log('Successfully deleted file', filePath);
                    }
                });
            });
        });
    }
}