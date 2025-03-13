// Script example for ScriptAPI
// Author: zLemonDev <https://github.com/zLemonDev>
// Project: https://github.com/JaylyDev/ScriptAPI
// Created: 2025-03-13

import { world, system, Player, ItemStack } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

// Reward pools for different quests
const rewardPool = [
    new ItemStack("minecraft:diamond", 3),
    new ItemStack("minecraft:iron_ingot", 5),
    new ItemStack("minecraft:gold_ingot", 3),
    new ItemStack("minecraft:emerald", 2),
    new ItemStack("minecraft:apple", 10),
    new ItemStack("minecraft:chicken_spawn_egg", 1),
    new ItemStack("minecraft:cow_spawn_egg", 1),
    new ItemStack("minecraft:sheep_spawn_egg", 1),
    new ItemStack("minecraft:wheat_seeds", 5),
    new ItemStack("minecraft:potato", 5),
    new ItemStack("minecraft:carrot", 5),
    new ItemStack("minecraft:pig_spawn_egg", 1),
    new ItemStack("minecraft:bread", 20),
    new ItemStack("minecraft:cooked_beef", 24),
    // New high-tier rewards
    new ItemStack("minecraft:diamond_pickaxe", 1),
    new ItemStack("minecraft:enchanted_book", 1),
    new ItemStack("minecraft:golden_apple", 3),
    new ItemStack("minecraft:experience_bottle", 16),
    new ItemStack("minecraft:name_tag", 2),
    new ItemStack("minecraft:saddle", 1),
    new ItemStack("minecraft:diamond_horse_armor", 1),
    new ItemStack("minecraft:trident", 1),
    new ItemStack("minecraft:turtle_helmet", 1),
    new ItemStack("minecraft:heart_of_the_sea", 1)
];

// Target pools for different quest types
const digTargets = [
    "minecraft:stone",
    "minecraft:dirt",
    "minecraft:grass_block",
    "minecraft:sand",
    "minecraft:gravel",
    "minecraft:cobblestone",
    "minecraft:deepslate",
    "minecraft:netherrack",
    "minecraft:coal_ore",
    "minecraft:deepslate_coal_ore",
    "minecraft:iron_ore",
    "minecraft:deepslate_iron_ore",
    "minecraft:gold_ore",
    "minecraft:deepslate_gold_ore",
    "minecraft:redstone_ore",
    "minecraft:deepslate_redstone_ore",
    "minecraft:lapis_ore",
    "minecraft:deepslate_lapis_ore",
    "minecraft:nether_gold_ore",
    "minecraft:ancient_debris",
    "minecraft:oak_log",
    "minecraft:birch_log",
    "minecraft:jungle_log",
    "minecraft:spruce_log",
    "minecraft:dark_oak_log",
    "minecraft:cherry_log"
];

const animalTargets = [
    "minecraft:cow",
    "minecraft:chicken",
    "minecraft:pig",
    "minecraft:sheep",
    "minecraft:rabbit",
    "minecraft:goat"
];

const monsterTargets = [
    "minecraft:zombie",
    "minecraft:skeleton",
    "minecraft:spider",
    "minecraft:creeper",
    "minecraft:husk"
];

const collectTargets = [
    "minecraft:wheat",
    "minecraft:carrot",
    "minecraft:potato",
    "minecraft:beetroot",
    "minecraft:melon_slice",
    "minecraft:pumpkin",
    "minecraft:sweet_berries",
    "minecraft:sugar_cane",
    "minecraft:bamboo",
    "minecraft:kelp"
];

const craftingTargets = [
    "minecraft:wooden_pickaxe",
    "minecraft:stone_pickaxe",
    "minecraft:iron_pickaxe",
    "minecraft:furnace",
    "minecraft:chest",
    "minecraft:crafting_table",
    "minecraft:torch",
    "minecraft:bread",
    "minecraft:cookie",
    "minecraft:cake"
];

const fishingTargets = [
    "minecraft:cod",
    "minecraft:salmon",
    "minecraft:tropical_fish",
    "minecraft:pufferfish"
];

const farmingTargets = [
    "minecraft:wheat_seeds",
    "minecraft:carrot",
    "minecraft:potato",
    "minecraft:beetroot_seeds",
    "minecraft:melon_seeds",
    "minecraft:pumpkin_seeds"
];

// Player quest storage
const playerQuests = new Map();

// Quest assignment function
function assignRandomQuest(player: Player) {
    const questTypes = [
        "ขุดบล็อค",
        "ฆ่าสัตว์",
        "ฆ่ามอนเตอร์",
        "เก็บของ",
        "คราฟของ",
        "จับปลา",
        "ปลูกพืช"
    ];

    const type = questTypes[Math.floor(Math.random() * questTypes.length)];
    let target = "";
    let amount = 0;

    // Assign amount and target based on quest type
    switch (type) {
        case "ขุดบล็อค":
            target = digTargets[Math.floor(Math.random() * digTargets.length)];
            amount = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
            break;
        case "ฆ่าสัตว์":
            target = animalTargets[Math.floor(Math.random() * animalTargets.length)];
            amount = Math.floor(Math.random() * (30 - 15 + 1)) + 15;
            break;
        case "ฆ่ามอนเตอร์":
            target = monsterTargets[Math.floor(Math.random() * monsterTargets.length)];
            amount = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
            break;
        case "เก็บของ":
            target = collectTargets[Math.floor(Math.random() * collectTargets.length)];
            amount = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
            break;
        case "คราฟของ":
            target = craftingTargets[Math.floor(Math.random() * craftingTargets.length)];
            amount = Math.floor(Math.random() * (10 - 3 + 1)) + 3;
            break;
        case "จับปลา":
            target = fishingTargets[Math.floor(Math.random() * fishingTargets.length)];
            amount = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
            break;
        case "ปลูกพืช":
            target = farmingTargets[Math.floor(Math.random() * farmingTargets.length)];
            amount = Math.floor(Math.random() * (25 - 10 + 1)) + 10;
            break;
    }

    const quest = {
        type,
        target,
        amount,
        progress: 0,
        completed: false,
        startTime: Date.now()
    };

    playerQuests.set(player.id, quest);
    player.sendMessage(`§6เควสใหม่มาแล้ว!`);
    player.sendMessage(`§f➡ ${type.toUpperCase()} §7(${target.replace("minecraft:", "")} x${amount})`);
}

// Quest completion function
function completeQuest(player: Player) {
    const quest = playerQuests.get(player.id);
    if (!quest) return;
    quest.completed = true;
    player.sendMessage(`§aเควสสำเร็จแล้ว!`);
    player.sendMessage(`§f▶ เปิดสมุดเพื่อรับของรางวัลของคุณ`);
}

// Quest progress update function
function updateQuestProgress(player: Player, type: string, target: string) {
    const quest = playerQuests.get(player.id);
    if (!quest || quest.type !== type || quest.target !== target || quest.completed) return;
    quest.progress++;
    player.sendMessage(`§f➡ §eความคืบหน้า:§6 ${quest.progress}/${quest.amount}`);
    if (quest.progress >= quest.amount) completeQuest(player);
}

// Event handlers
world.beforeEvents.playerBreakBlock.subscribe((event) => {
    updateQuestProgress(event.player, "ขุดบล็อค", event.block.typeId);
});

world.afterEvents.entityDie.subscribe((event) => {
    if (!event.damageSource.damagingEntity || !(event.damageSource.damagingEntity instanceof Player)) return;
    const player = event.damageSource.damagingEntity;
    const entity = event.deadEntity;

    if (entity.typeId.startsWith("minecraft:")) {
        if (animalTargets.includes(entity.typeId)) {
            updateQuestProgress(player, "ฆ่าสัตว์", entity.typeId);
        } else if (monsterTargets.includes(entity.typeId)) {
            updateQuestProgress(player, "ฆ่ามอนเตอร์", entity.typeId);
        }
    }
});

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
    const player = event.player;
    const quest = playerQuests.get(player.id);

    if (quest?.type === "จับปลา" && event.block.typeId === "minecraft:water") {
        updateQuestProgress(player, "จับปลา", quest.target);
    }
});

world.afterEvents.itemCompleteCharge.subscribe((event) => {
    const player = event.source;
    if (!(player instanceof Player)) return;
    const quest = playerQuests.get(player.id);

    if (quest?.type === "คราฟของ") {
        updateQuestProgress(player, "คราฟของ", quest.target);
    }
});

world.afterEvents.itemAcquired.subscribe((event) => {
    const player = event.player;
    const quest = playerQuests.get(player.id);

    if (quest?.type === "เก็บของ" && event.item.typeId === quest.target) {
        updateQuestProgress(player, "เก็บของ", quest.target);
    }
});

world.afterEvents.playerPlaceBlock.subscribe((event) => {
    const player = event.player;
    const quest = playerQuests.get(player.id);

    if (quest?.type === "ปลูกพืช" && event.block.typeId === quest.target) {
        updateQuestProgress(player, "ปลูกพืช", quest.target);
    }
});

// Quest book interface
world.afterEvents.itemUse.subscribe((event) => {
    if (event.itemStack.typeId !== "lemon:quest_books") return;
    const player = event.source;
    if (!(player instanceof Player)) return;

    let quest = playerQuests.get(player.id);
    if (!quest) {
        assignRandomQuest(player);
        quest = playerQuests.get(player.id);
    }

    const form = new ActionFormData()
        .title("§bQuest Status");

    if (quest.completed) {
        form.body(
            `§6คุณทำเควสสำเร็จแล้ว!\n\n` +
            `§f▶ §eประเภท: §a${quest.type.toUpperCase()}\n` +
            `§f▶ §eเป้าหมาย: §b${quest.target.replace("minecraft:", "")}\n` +
            `§f▶ §eความคืบหน้า: §6${quest.amount}/${quest.amount}\n\n` +
            `กด "รับรางวัล" เพื่อรับรางวัลของคุณ!`
        )
            .button("รับของรางวัล!")
            .button("ปิดหน้าต่าง");
    } else {
        const timePassed = Math.floor((Date.now() - quest.startTime) / 1000);
        const timeString = formatTime(timePassed);

        form.body(
            `§6เควสปัจจุบันของคุณ\n\n` +
            `§f▶ §eประเภท: §a${quest.type.toUpperCase()}\n` +
            `§f▶ §eเป้าหมาย: §b${quest.target.replace("minecraft:", "")}\n` +
            `§f▶ §eความคืบหน้า: §6${quest.progress}/${quest.amount}\n` +
            `§f▶ §eเวลาที่ใช้: §6${timeString}\n\n` +
            `§d ทำต่อไป! ทำภารกิจให้สำเร็จเพื่อรับรางวัล!`
        )
            .button("ปิดหน้าต่าง");
    }

    form.show(player).then((response) => {
        if (response.selection === 0 && quest.completed) {
            const reward = rewardPool[Math.floor(Math.random() * rewardPool.length)];
            player.getComponent("inventory")?.container?.addItem(reward);
            player.sendMessage(`§aคุณได้รับของรางวัล: §b${reward.amount}x ${reward.typeId.replace("minecraft:", "")}`);
            assignRandomQuest(player);
        }
    });
});

// Player spawn handler for quest book
world.afterEvents.playerSpawn.subscribe((event) => {
    system.runTimeout(() => {
        const player = event.player;
        if (!player) return;

        const inventory = player.getComponent("inventory")?.container;
        if (inventory) {
            let hasBook = false;
            for (let i = 0; i < inventory.size; i++) {
                const item = inventory.getItem(i);
                if (item && item.typeId === "lemon:quest_books") {
                    hasBook = true;
                    break;
                }
            }

            if (!hasBook) {
                const success = inventory.addItem(new ItemStack("lemon:quest_books", 1));
                if (success) {
                    player.sendMessage("§eคุณได้รับ §aสมุดเควส §eแล้ว!");
                }
            }
        }

        if (!playerQuests.has(player.id)) {
            assignRandomQuest(player);
        }
    }, 20);
});

// Utility function to format time
function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (hours > 0) parts.push(`${hours} ชั่วโมง`);
    if (minutes > 0) parts.push(`${minutes} นาที`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds} วินาที`);

    return parts.join(" ");
}