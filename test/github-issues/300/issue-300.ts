import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src/connection/Connection";
import {expect} from "chai";
import {Race} from "./entity/Race";

describe("github issues > support of embeddeds that are not set", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchemaOnConnection: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("embedded with custom column name should persist and load without errors", () => Promise.all(connections.map(async connection => {

        const race = new Race();
        race.name = "National Race";

        await connection.manager.save(race);

        const loadedRace = await connection.manager.findOne(Race, { name: "National Race" });
        expect(loadedRace).to.exist;
        expect(loadedRace!.id).to.exist;
        loadedRace!.name.should.be.equal("National Race");
        expect(loadedRace!.duration).to.exist;
        expect(loadedRace!.duration.minutes).to.be.null;
        expect(loadedRace!.duration.hours).to.be.null;
        expect(loadedRace!.duration.days).to.be.null;

    })));

});
