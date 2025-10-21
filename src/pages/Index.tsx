import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Choice {
  text: string;
  affection: number;
  nextId?: number;
}

interface DialogueNode {
  id: number;
  speaker: string;
  text: string;
  choices?: Choice[];
  nextId?: number;
  isEnding?: boolean;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: string;
}

interface SaveSlot {
  id: number;
  name: string;
  dialogueId: number;
  affection: number;
  timestamp: string;
  unlockedEndings: string[];
}

const Index = () => {
  const [currentSection, setCurrentSection] = useState<'menu' | 'story'>('menu');
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [affectionLevel, setAffectionLevel] = useState(0);
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>([]);
  const [unlockedGallery, setUnlockedGallery] = useState<number[]>([]);
  const [volume, setVolume] = useState(70);
  const [textSpeed, setTextSpeed] = useState(50);
  const [autoPlay, setAutoPlay] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_meeting', name: 'Первая встреча', description: 'Начните новую игру', unlocked: false, icon: 'Sparkles' },
    { id: 'brave_heart', name: 'Храброе сердце', description: 'Вызовите Burning Spice на дуэль', unlocked: false, icon: 'Swords' },
    { id: 'smooth_talker', name: 'Гладкий говорун', description: 'Пригласите на ужин', unlocked: false, icon: 'Heart' },
    { id: 'max_affection', name: 'Пылающая любовь', description: 'Достигните максимального уровня привязанности', unlocked: false, icon: 'Flame' },
    { id: 'all_endings', name: 'Коллекционер концовок', description: 'Разблокируйте все концовки', unlocked: false, icon: 'Trophy' },
    { id: 'gallery_complete', name: 'Ценитель искусства', description: 'Откройте всю галерею', unlocked: false, icon: 'Image' },
  ]);
  const [saves, setSaves] = useState<SaveSlot[]>([]);

  const dialogues: DialogueNode[] = [
    {
      id: 0,
      speaker: 'Burning Spice Cookie',
      text: 'Что за наглец осмелился потревожить мой покой в Пылающей Пустыне?! Ты не знаешь, с кем связался!',
      choices: [
        { text: 'Я пришёл проверить твою легендарную силу', affection: 5, nextId: 1 },
        { text: 'Прости, я случайно заблудился...', affection: -3, nextId: 2 },
        { text: 'Я слышал, ты лучший воин в Cookie Run Kingdom', affection: 10, nextId: 3 },
      ],
    },
    {
      id: 1,
      speaker: 'Burning Spice Cookie',
      text: 'Проверить МОЮ силу? Ха! Ты либо храбрец, либо глупец. Впрочем... мне нравится твоя смелость.',
      choices: [
        { text: 'Может, обсудим это за ужином?', affection: 15, nextId: 4 },
        { text: 'Давай устроим дуэль прямо сейчас!', affection: 8, nextId: 5 },
        { text: 'Расскажи мне о своих подвигах', affection: 12, nextId: 6 },
      ],
    },
    {
      id: 2,
      speaker: 'Burning Spice Cookie',
      text: 'Заблудился? В МОЕЙ пустыне?! Жалкое оправдание... Хотя, ты выглядишь довольно... интересно для потерявшегося путника.',
      choices: [
        { text: 'Может быть, ты покажешь мне дорогу?', affection: 7, nextId: 6 },
        { text: 'Я специально пришёл сюда, чтобы встретить тебя', affection: 15, nextId: 3 },
        { text: 'Я действительно заблудился, помоги мне!', affection: -5, nextId: 7 },
      ],
    },
    {
      id: 3,
      speaker: 'Burning Spice Cookie',
      text: 'Лучший воин? Хм... Наконец-то кто-то признал очевидное! Ты явно печенька со вкусом. Давай поговорим подробнее.',
      choices: [
        { text: 'Я восхищаюсь твоей мощью', affection: 10, nextId: 8 },
        { text: 'Научи меня своим боевым приёмам', affection: 8, nextId: 9 },
        { text: 'А можешь показать свою силу на практике?', affection: 5, nextId: 5 },
      ],
    },
    {
      id: 4,
      speaker: 'Burning Spice Cookie',
      text: 'Ужин? УЖИН?! Ха-ха-ха! Никто ещё не осмеливался предложить МНЕ такое... Знаешь что? Принято. Ты меня заинтриговал.',
      nextId: 10,
    },
    {
      id: 5,
      speaker: 'Burning Spice Cookie',
      text: 'Дуэль! Вот это я понимаю! Но знай - я не сдерживаю свою силу. Ты готов к этому испытанию?',
      choices: [
        { text: 'Абсолютно готов! Начинаем!', affection: 10, nextId: 11 },
        { text: 'Может, сначала разомнёмся вместе?', affection: 12, nextId: 12 },
        { text: 'Подожди, я передумал...', affection: -10, nextId: 7 },
      ],
    },
    {
      id: 6,
      speaker: 'Burning Spice Cookie',
      text: 'О моих подвигах? Сядь поудобнее, это будет долгий рассказ. Я завоевал тысячи земель, победил бесчисленных врагов...',
      choices: [
        { text: 'Ты восхитителен!', affection: 15, nextId: 13 },
        { text: 'Продолжай, я весь внимание', affection: 10, nextId: 13 },
        { text: 'Звучит слишком самоуверенно', affection: -5, nextId: 14 },
      ],
    },
    {
      id: 7,
      speaker: 'Burning Spice Cookie',
      text: 'Ты разочаровал меня. Убирайся из моей пустыни, пока я не передумал!',
      isEnding: true,
      choices: [
        { text: 'Начать заново', affection: 0, nextId: 0 },
      ],
    },
    {
      id: 8,
      speaker: 'Burning Spice Cookie',
      text: 'Восхищаешься? Хм... Редко встречаю тех, кто понимает истинное величие. Ты не такой, как остальные...',
      choices: [
        { text: 'Потому что ты особенный', affection: 20, nextId: 15 },
        { text: 'Я хочу узнать тебя лучше', affection: 18, nextId: 16 },
        { text: 'Давай станем партнёрами', affection: 12, nextId: 17 },
      ],
    },
    {
      id: 9,
      speaker: 'Burning Spice Cookie',
      text: 'Научить тебя? Интересная просьба... Обычно я просто сжигаю своих противников. Но для тебя сделаю исключение.',
      nextId: 12,
    },
    {
      id: 10,
      speaker: 'Рассказчик',
      text: 'Вы провели вечер за ужином. Burning Spice Cookie оказался неожиданно обаятельным собеседником. Пламя пустыни отражалось в его глазах, и вы чувствовали, как между вами что-то зарождается...',
      nextId: 18,
    },
    {
      id: 11,
      speaker: 'Burning Spice Cookie',
      text: 'Отличный бой! Ты держался лучше, чем я ожидал. Знаешь... Я давно не встречал достойного соперника. Может, ты станешь чем-то большим?',
      choices: [
        { text: 'Я хочу стать твоим партнёром', affection: 15, nextId: 17 },
        { text: 'Давай сражаться бок о бок', affection: 12, nextId: 19 },
        { text: 'Научи меня быть сильнее', affection: 10, nextId: 12 },
      ],
    },
    {
      id: 12,
      speaker: 'Burning Spice Cookie',
      text: 'Разминка? Хм, интересное предложение... Ладно, покажу тебе пару приёмов. Но будь осторожен - моё пламя обжигает.',
      nextId: 20,
    },
    {
      id: 13,
      speaker: 'Burning Spice Cookie',
      text: 'Ты слушаешь меня с таким вниманием... Знаешь, это приятно. Обычно все просто убегают в страхе. А ты... другой.',
      choices: [
        { text: 'Потому что ты достоин восхищения', affection: 20, nextId: 15 },
        { text: 'Расскажи ещё что-нибудь', affection: 8, nextId: 21 },
        { text: 'Может, создадим новую легенду вместе?', affection: 18, nextId: 22 },
      ],
    },
    {
      id: 14,
      speaker: 'Burning Spice Cookie',
      text: 'Самоуверенно?! Это называется УВЕРЕННОСТЬ! Но... может, ты прав. Может, я просто хочу произвести впечатление...',
      choices: [
        { text: 'Ты уже произвёл впечатление', affection: 15, nextId: 15 },
        { text: 'Будь собой, это важнее', affection: 12, nextId: 23 },
      ],
    },
    {
      id: 15,
      speaker: 'Burning Spice Cookie',
      text: 'Особенный... Знаешь, никто никогда не говорил мне таких слов. Все видят только силу и ярость. Но ты... ты видишь меня.',
      nextId: 24,
    },
    {
      id: 16,
      speaker: 'Burning Spice Cookie',
      text: 'Узнать меня лучше? Хм... Обычно я не подпускаю никого так близко. Но с тобой... всё как-то по-другому.',
      nextId: 24,
    },
    {
      id: 17,
      speaker: 'Burning Spice Cookie',
      text: 'Партнёры... Да, это слово мне нравится. Вместе мы будем непобедимы! Но знай - я не делюсь своей силой просто так.',
      nextId: 25,
    },
    {
      id: 18,
      speaker: 'Burning Spice Cookie',
      text: 'Этот вечер был... неожиданным. Я не думал, что меня может кто-то так увлечь. Возможно, пламя в моём сердце горит не только от ярости...',
      nextId: 26,
    },
    {
      id: 19,
      speaker: 'Burning Spice Cookie',
      text: 'Бок о бок в бою... Это звучит как настоящее партнёрство. Да, я согласен. Но помни - я буду защищать тебя всем своим пламенем!',
      nextId: 25,
    },
    {
      id: 20,
      speaker: 'Рассказчик',
      text: 'Вы тренировались вместе под палящим солнцем пустыни. С каждым движением, с каждым взглядом вы чувствовали растущую связь между вами...',
      nextId: 27,
    },
    {
      id: 21,
      speaker: 'Burning Spice Cookie',
      text: 'Ещё истории? Ладно... Знаешь, однажды я сражался с тремя драконами одновременно. Это было... стоп, почему я так стараюсь впечатлить ТЕБЯ?',
      choices: [
        { text: 'Потому что я особенный для тебя?', affection: 20, nextId: 15 },
        { text: 'Твои истории восхитительны', affection: 10, nextId: 28 },
      ],
    },
    {
      id: 22,
      speaker: 'Burning Spice Cookie',
      text: 'Новую легенду... вместе? Ты предлагаешь мне нечто, о чём я даже не мечтал. Да! Давай напишем историю, которую будут помнить вечно!',
      nextId: 29,
    },
    {
      id: 23,
      speaker: 'Burning Spice Cookie',
      text: 'Быть собой... Мудрые слова. Знаешь, с тобой я чувствую, что могу снять маску грозного воина. Спасибо...',
      nextId: 24,
    },
    {
      id: 24,
      speaker: 'Burning Spice Cookie',
      text: 'Я никогда не думал, что скажу это, но... ты стал важен для меня. Моё пламя горит ярче, когда ты рядом.',
      nextId: 30,
    },
    {
      id: 25,
      speaker: 'Burning Spice Cookie',
      text: 'Вместе мы покорим все королевства! Но главное... я наконец нашёл того, кто понимает меня. Это дороже любой победы.',
      nextId: 31,
    },
    {
      id: 26,
      speaker: 'Рассказчик',
      text: 'Под звёздным небом пустыни Burning Spice Cookie взял вашу руку. Его пламя согревало, но не обжигало. Это было начало чего-то особенного...',
      nextId: 32,
    },
    {
      id: 27,
      speaker: 'Burning Spice Cookie',
      text: 'Ты быстро учишься... Слишком быстро. Может, я просто хороший учитель? Или ты... вдохновляешь меня показать себя с лучшей стороны?',
      choices: [
        { text: 'Мы вдохновляем друг друга', affection: 20, nextId: 30 },
        { text: 'Ты лучший учитель', affection: 15, nextId: 33 },
      ],
    },
    {
      id: 28,
      speaker: 'Burning Spice Cookie',
      text: 'Восхитительны... Знаешь, я мог бы рассказывать тебе истории каждый вечер. Если ты останешься со мной.',
      nextId: 34,
    },
    {
      id: 29,
      speaker: 'Рассказчик',
      text: 'И так началась ваша совместная легенда. Два сердца, объединённых пламенем страсти и приключений. Burning Spice Cookie нашёл то, что искал всю жизнь - родственную душу.',
      nextId: 35,
    },
    {
      id: 30,
      speaker: 'Burning Spice Cookie',
      text: 'Да... мы вдохновляем друг друга. Я чувствую это каждой частичкой своей души. Останься со мной, и я покажу тебе, что такое настоящее пламя любви.',
      nextId: 36,
    },
    {
      id: 31,
      speaker: 'Рассказчик',
      text: 'КОНЦОВКА: "Партнёры в огне и любви" - Вы стали непобедимой командой, покоряя королевства и сердца. Уровень привязанности: ' + affectionLevel,
      isEnding: true,
      choices: [
        { text: 'Начать заново', affection: 0, nextId: 0 },
        { text: 'Вернуться в меню', affection: 0 },
      ],
    },
    {
      id: 32,
      speaker: 'Burning Spice Cookie',
      text: 'Эта ночь... я запомню её навсегда. Ты изменил меня, сделал лучше. Моё сердце больше не холодная пустыня - оно горит для тебя.',
      nextId: 37,
    },
    {
      id: 33,
      speaker: 'Burning Spice Cookie',
      text: 'Лучший учитель? Может быть. Но ты - лучший ученик. И не только ученик... Ты тот, кто зажёг огонь в моём сердце.',
      nextId: 36,
    },
    {
      id: 34,
      speaker: 'Burning Spice Cookie',
      text: 'Останешься? Я... я хочу, чтобы ты остался. Не как гость, не как союзник. Как... тот, кто разделит со мной моё пламя.',
      nextId: 38,
    },
    {
      id: 35,
      speaker: 'Burning Spice Cookie',
      text: 'Наша легенда только начинается! Я обещаю - каждый день с тобой будет приключением. Ты моё величайшее сокровище.',
      nextId: 39,
    },
    {
      id: 36,
      speaker: 'Рассказчик',
      text: 'КОНЦОВКА: "Пылающие сердца" - Ваша любовь стала легендой Cookie Run Kingdom. Два воина, две души, объединённые вечным пламенем. Уровень привязанности: ' + affectionLevel,
      isEnding: true,
      choices: [
        { text: 'Начать заново', affection: 0, nextId: 0 },
        { text: 'Вернуться в меню', affection: 0 },
      ],
    },
    {
      id: 37,
      speaker: 'Рассказчик',
      text: 'КОНЦОВКА: "Звёздная ночь пустыни" - Под звёздным небом вы нашли друг друга. Романтическая концовка разблокирована! Уровень привязанности: ' + affectionLevel,
      isEnding: true,
      choices: [
        { text: 'Начать заново', affection: 0, nextId: 0 },
        { text: 'Вернуться в меню', affection: 0 },
      ],
    },
    {
      id: 38,
      speaker: 'Рассказчик',
      text: 'Вы приняли его предложение. Теперь пустыня стала вашим домом, а Burning Spice Cookie - вашим спутником жизни.',
      nextId: 40,
    },
    {
      id: 39,
      speaker: 'Рассказчик',
      text: 'КОНЦОВКА: "Легенда двух сердец" - Ваши имена навсегда вписаны в историю как величайший дуэт воинов и влюблённых. Уровень привязанности: ' + affectionLevel,
      isEnding: true,
      choices: [
        { text: 'Начать заново', affection: 0, nextId: 0 },
        { text: 'Вернуться в меню', affection: 0 },
      ],
    },
    {
      id: 40,
      speaker: 'Burning Spice Cookie',
      text: 'Каждое утро я буду просыпаться рядом с тобой. Каждый вечер - засыпать под твоё дыхание. Это... это всё, о чём я мечтал, даже не зная.',
      nextId: 41,
    },
    {
      id: 41,
      speaker: 'Рассказчик',
      text: 'КОНЦОВКА: "Вечное пламя любви" - Истинная концовка разблокирована! Вы достигли совершенной гармонии. Уровень привязанности: ' + affectionLevel,
      isEnding: true,
      choices: [
        { text: 'Начать заново', affection: 0, nextId: 0 },
        { text: 'Вернуться в меню', affection: 0 },
      ],
    },
  ];

  const handleChoice = (choice: Choice) => {
    const newAffection = affectionLevel + choice.affection;
    setAffectionLevel(newAffection);
    
    // Unlock achievements
    const newAchievements = [...achievements];
    if (currentDialogue === 0 && !achievements[0].unlocked) {
      newAchievements[0].unlocked = true;
      setAchievements(newAchievements);
    }
    if (choice.text.includes('дуэль') && !achievements[1].unlocked) {
      newAchievements[1].unlocked = true;
      setAchievements(newAchievements);
    }
    if (choice.text.includes('ужин') && !achievements[2].unlocked) {
      newAchievements[2].unlocked = true;
      setAchievements(newAchievements);
    }
    if (newAffection >= 100 && !achievements[3].unlocked) {
      newAchievements[3].unlocked = true;
      setAchievements(newAchievements);
    }

    // Handle navigation
    if (choice.text === 'Вернуться в меню') {
      setCurrentSection('menu');
      setCurrentDialogue(0);
      setAffectionLevel(0);
      return;
    }

    if (choice.text === 'Начать заново') {
      setCurrentDialogue(0);
      setAffectionLevel(0);
      return;
    }

    if (choice.nextId !== undefined) {
      setCurrentDialogue(choice.nextId);
    } else {
      const current = dialogues[currentDialogue];
      if (current.nextId !== undefined) {
        setCurrentDialogue(current.nextId);
      } else if (currentDialogue < dialogues.length - 1) {
        setCurrentDialogue(currentDialogue + 1);
      }
    }

    // Unlock gallery items based on affection
    if (newAffection >= 20 && !unlockedGallery.includes(0)) {
      setUnlockedGallery([...unlockedGallery, 0]);
    }
    if (newAffection >= 40 && !unlockedGallery.includes(1)) {
      setUnlockedGallery([...unlockedGallery, 1]);
    }
    if (newAffection >= 60 && !unlockedGallery.includes(2)) {
      setUnlockedGallery([...unlockedGallery, 2]);
    }
    if (newAffection >= 80 && !unlockedGallery.includes(3)) {
      setUnlockedGallery([...unlockedGallery, 3]);
    }
    if (newAffection >= 100 && !unlockedGallery.includes(4)) {
      setUnlockedGallery([...unlockedGallery, 4]);
    }
    if (newAffection >= 120 && !unlockedGallery.includes(5)) {
      setUnlockedGallery([...unlockedGallery, 5]);
    }

    // Check for endings
    const currentNode = dialogues[choice.nextId || currentDialogue + 1];
    if (currentNode?.isEnding) {
      const endingName = currentNode.text.match(/КОНЦОВКА: "([^"]+)"/)?.[1] || 'ending_' + currentDialogue;
      if (!unlockedEndings.includes(endingName)) {
        setUnlockedEndings([...unlockedEndings, endingName]);
      }
    }
  };

  const handleContinue = () => {
    const current = dialogues[currentDialogue];
    if (current.nextId !== undefined) {
      setCurrentDialogue(current.nextId);
    } else if (currentDialogue < dialogues.length - 1) {
      setCurrentDialogue(currentDialogue + 1);
    }
  };

  const handleSave = (slotId: number) => {
    const newSave: SaveSlot = {
      id: slotId,
      name: `Сохранение ${slotId}`,
      dialogueId: currentDialogue,
      affection: affectionLevel,
      timestamp: new Date().toLocaleString('ru-RU'),
      unlockedEndings: [...unlockedEndings],
    };
    
    const newSaves = [...saves];
    const existingIndex = newSaves.findIndex(s => s.id === slotId);
    if (existingIndex >= 0) {
      newSaves[existingIndex] = newSave;
    } else {
      newSaves.push(newSave);
    }
    setSaves(newSaves);
  };

  const handleLoad = (save: SaveSlot) => {
    setCurrentDialogue(save.dialogueId);
    setAffectionLevel(save.affection);
    setUnlockedEndings(save.unlockedEndings);
    setCurrentSection('story');
  };

  const getAffectionColor = () => {
    if (affectionLevel < 0) return 'text-blue-500';
    if (affectionLevel < 30) return 'text-gray-400';
    if (affectionLevel < 60) return 'text-yellow-500';
    if (affectionLevel < 100) return 'text-orange-500';
    return 'text-red-500';
  };

  const getAffectionLabel = () => {
    if (affectionLevel < 0) return 'Враждебность';
    if (affectionLevel < 30) return 'Нейтралитет';
    if (affectionLevel < 60) return 'Симпатия';
    if (affectionLevel < 100) return 'Привязанность';
    return 'Любовь';
  };

  const currentNode = dialogues[currentDialogue];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-amber-900 to-red-950">
      {currentSection === 'menu' ? (
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
              BURNING SPICE STORY
            </h1>
            <p className="text-lg md:text-xl text-gray-200">Сатирическая яой визуальная новелла</p>
            <Badge className="mt-4 text-base md:text-lg px-4 md:px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 border-orange-400">
              Cookie Run Kingdom Parody
            </Badge>
          </div>

          <Tabs defaultValue="story" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8 bg-black/40 backdrop-blur">
              <TabsTrigger value="story" className="flex items-center gap-1 md:gap-2">
                <Icon name="BookOpen" size={18} />
                <span className="text-xs md:text-sm">Сюжет</span>
              </TabsTrigger>
              <TabsTrigger value="characters" className="flex items-center gap-1 md:gap-2">
                <Icon name="Users" size={18} />
                <span className="text-xs md:text-sm">Герои</span>
              </TabsTrigger>
              <TabsTrigger value="gallery" className="flex items-center gap-1 md:gap-2">
                <Icon name="Image" size={18} />
                <span className="text-xs md:text-sm">Галерея</span>
              </TabsTrigger>
              <TabsTrigger value="achievements" className="flex items-center gap-1 md:gap-2">
                <Icon name="Trophy" size={18} />
                <span className="text-xs md:text-sm">Награды</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1 md:gap-2">
                <Icon name="Settings" size={18} />
                <span className="text-xs md:text-sm">Настройки</span>
              </TabsTrigger>
              <TabsTrigger value="saves" className="flex items-center gap-1 md:gap-2">
                <Icon name="Save" size={18} />
                <span className="text-xs md:text-sm">Сохранения</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="story" className="space-y-6">
              <Card className="p-6 md:p-8 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-lg border-orange-800/50 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-400 flex items-center gap-3">
                  <Icon name="Flame" size={32} className="text-red-500" />
                  Начать приключение
                </h2>
                <p className="text-base md:text-lg mb-6 text-gray-200 leading-relaxed">
                  Погрузись в безумный мир Cookie Run Kingdom, где тебя ждёт встреча с легендарным Burning Spice Cookie!
                  Твои выборы определят романтическую концовку этой сатирической истории. Сможешь ли ты растопить его пылающее сердце?
                </p>
                <div className="mb-6 p-4 bg-orange-950/50 rounded-lg border border-orange-800/30">
                  <h3 className="font-semibold text-orange-300 mb-2 flex items-center gap-2">
                    <Icon name="Sparkles" size={20} />
                    Особенности:
                  </h3>
                  <ul className="space-y-2 text-gray-300 text-sm md:text-base">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Множественные концовки в зависимости от ваших решений</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Система привязанности влияет на развитие сюжета</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Разблокируемые CG-арты и достижения</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-500 mt-1 flex-shrink-0" />
                      <span>Система сохранений для прохождения всех путей</span>
                    </li>
                  </ul>
                </div>
                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 hover:from-orange-500 hover:via-red-500 hover:to-orange-500 text-white text-lg md:text-xl py-6 md:py-7 shadow-lg hover:shadow-orange-500/50 transition-all duration-300"
                  onClick={() => {
                    setCurrentSection('story');
                    if (!achievements[0].unlocked) {
                      const newAchievements = [...achievements];
                      newAchievements[0].unlocked = true;
                      setAchievements(newAchievements);
                    }
                  }}
                >
                  <Icon name="Play" size={24} className="mr-2" />
                  Начать визуальную новеллу
                </Button>
                {unlockedEndings.length > 0 && (
                  <div className="mt-4 text-center">
                    <Badge variant="outline" className="bg-orange-950/50 text-orange-300 border-orange-700">
                      Разблокировано концовок: {unlockedEndings.length}
                    </Badge>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="characters" className="space-y-6">
              <Card className="p-6 md:p-8 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-lg border-orange-800/50 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-400 flex items-center gap-3">
                  <Icon name="Users" size={32} />
                  Персонажи
                </h2>
                <div className="space-y-6">
                  <div className="border-l-4 border-red-600 pl-6 bg-gradient-to-r from-red-950/30 to-transparent py-4 rounded-r-lg">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                      <h3 className="text-xl md:text-2xl font-bold text-orange-300">Burning Spice Cookie</h3>
                      <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
                        <Icon name="Flame" size={16} className="mr-1" />
                        Легендарный воин
                      </Badge>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-3">
                      Могущественный печеньковый воин из Пылающей Пустыни. Известен своим вспыльчивым характером
                      и невероятной боевой мощью. За тысячелетия завоевал бесчисленные земли и победил легионы врагов.
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-3">
                      Но под этой грозной оболочкой скрывается одинокое сердце, которое никогда не знало настоящей близости.
                      Сможешь ли ты стать тем, кто растопит лёд одиночества в его пылающей душе?
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="outline" className="bg-orange-950/30 text-orange-300 border-orange-700">
                        <Icon name="Swords" size={14} className="mr-1" />
                        Мастер боя
                      </Badge>
                      <Badge variant="outline" className="bg-orange-950/30 text-orange-300 border-orange-700">
                        <Icon name="Crown" size={14} className="mr-1" />
                        Завоеватель
                      </Badge>
                      <Badge variant="outline" className="bg-orange-950/30 text-orange-300 border-orange-700">
                        <Icon name="Heart" size={14} className="mr-1" />
                        Романтик (?)
                      </Badge>
                    </div>
                  </div>

                  <div className="border-l-4 border-yellow-600 pl-6 bg-gradient-to-r from-yellow-950/30 to-transparent py-4 rounded-r-lg">
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                      <h3 className="text-xl md:text-2xl font-bold text-yellow-300">Вы (Игрок)</h3>
                      <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
                        <Icon name="User" size={16} className="mr-1" />
                        Искатель приключений
                      </Badge>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Смелая печенька, которая отважилась войти в Пылающую Пустыню. Ваши решения и слова определят,
                      какие отношения сложатся между вами и легендарным воином. Будете ли вы соперниками, партнёрами
                      или чем-то большим?
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-950/50 to-red-950/50 p-4 rounded-lg border border-orange-800/30">
                    <h3 className="font-semibold text-orange-300 mb-2 flex items-center gap-2">
                      <Icon name="Info" size={20} />
                      О мире игры:
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Cookie Run Kingdom - это вселенная, населённая печеньками с уникальными способностями и характерами.
                      Burning Spice Cookie - один из самых могущественных персонажей, чья сила сравнима с силой древних богов.
                      Эта визуальная новелла - сатирический фан-проект, созданный для развлечения поклонников игры.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="gallery" className="space-y-6">
              <Card className="p-6 md:p-8 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-lg border-orange-800/50 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-400 flex items-center gap-3">
                  <Icon name="Image" size={32} />
                  Галерея CG-артов
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { id: 0, title: 'Первая встреча', affection: 20 },
                    { id: 1, title: 'Огненная дуэль', affection: 40 },
                    { id: 2, title: 'Закат в пустыне', affection: 60 },
                    { id: 3, title: 'Совместная тренировка', affection: 80 },
                    { id: 4, title: 'Признание', affection: 100 },
                    { id: 5, title: 'Вечное пламя', affection: 120 },
                  ].map((item) => (
                    <div 
                      key={item.id} 
                      className="aspect-square bg-gradient-to-br from-orange-950/50 to-red-950/50 rounded-lg flex flex-col items-center justify-center border-2 border-orange-800/30 hover:border-orange-600/50 transition-all duration-300 p-4"
                    >
                      {unlockedGallery.includes(item.id) ? (
                        <>
                          <Icon name="Image" size={48} className="text-orange-400 mb-2" />
                          <p className="text-xs text-center text-gray-300 font-medium">{item.title}</p>
                          <Badge variant="outline" className="mt-2 text-xs bg-green-950/50 text-green-400 border-green-700">
                            <Icon name="Unlock" size={12} className="mr-1" />
                            Разблокировано
                          </Badge>
                        </>
                      ) : (
                        <>
                          <Icon name="Lock" size={48} className="text-gray-600 mb-2" />
                          <p className="text-xs text-center text-gray-500 font-medium">{item.title}</p>
                          <Badge variant="outline" className="mt-2 text-xs bg-gray-950/50 text-gray-500 border-gray-700">
                            Нужно {item.affection} привязанности
                          </Badge>
                        </>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center p-4 bg-orange-950/30 rounded-lg border border-orange-800/30">
                  <p className="text-gray-300 flex items-center justify-center gap-2 mb-2">
                    <Icon name="Sparkles" size={20} className="text-yellow-500" />
                    Разблокировано {unlockedGallery.length} из 6 артов
                  </p>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-orange-600 to-red-600 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${(unlockedGallery.length / 6) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-3">
                    Проходите игру, повышая уровень привязанности, чтобы разблокировать все CG-арты!
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card className="p-6 md:p-8 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-lg border-orange-800/50 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-400 flex items-center gap-3">
                  <Icon name="Trophy" size={32} />
                  Достижения
                </h2>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-yellow-950/30 to-orange-950/30 border-yellow-700/50' 
                          : 'bg-gray-950/30 border-gray-800/30'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${
                          achievement.unlocked 
                            ? 'bg-gradient-to-br from-yellow-600 to-orange-600' 
                            : 'bg-gray-800'
                        }`}>
                          <Icon 
                            name={achievement.icon} 
                            size={24} 
                            className={achievement.unlocked ? 'text-white' : 'text-gray-600'}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className={`font-bold text-lg ${
                              achievement.unlocked ? 'text-yellow-300' : 'text-gray-500'
                            }`}>
                              {achievement.name}
                            </h3>
                            {achievement.unlocked && (
                              <Badge className="bg-green-600 text-white">
                                <Icon name="Check" size={14} className="mr-1" />
                                Получено
                              </Badge>
                            )}
                          </div>
                          <p className={`text-sm ${
                            achievement.unlocked ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center p-4 bg-orange-950/30 rounded-lg border border-orange-800/30">
                  <p className="text-gray-300 flex items-center justify-center gap-2 mb-2">
                    <Icon name="Award" size={20} className="text-yellow-500" />
                    Получено {achievements.filter(a => a.unlocked).length} из {achievements.length} достижений
                  </p>
                  <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-600 to-orange-600 h-full transition-all duration-500 rounded-full"
                      style={{ width: `${(achievements.filter(a => a.unlocked).length / achievements.length) * 100}%` }}
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="p-6 md:p-8 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-lg border-orange-800/50 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-400 flex items-center gap-3">
                  <Icon name="Settings" size={32} />
                  Настройки
                </h2>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300 font-medium flex items-center gap-2">
                        <Icon name="Volume2" size={20} />
                        Громкость музыки
                      </label>
                      <span className="text-orange-400 font-bold">{volume}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-gray-300 font-medium flex items-center gap-2">
                        <Icon name="Gauge" size={20} />
                        Скорость текста
                      </label>
                      <span className="text-orange-400 font-bold">{textSpeed}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={textSpeed}
                      onChange={(e) => setTextSpeed(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800/50">
                    <label className="text-gray-300 font-medium flex items-center gap-2">
                      <Icon name="PlayCircle" size={20} />
                      Автоматическое воспроизведение
                    </label>
                    <Button
                      variant={autoPlay ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAutoPlay(!autoPlay)}
                      className={autoPlay ? "bg-orange-600 hover:bg-orange-700" : ""}
                    >
                      {autoPlay ? (
                        <>
                          <Icon name="Check" size={16} className="mr-1" />
                          Вкл
                        </>
                      ) : (
                        <>
                          <Icon name="X" size={16} className="mr-1" />
                          Выкл
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-gray-800">
                    <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
                      <Icon name="Info" size={24} />
                      О игре
                    </h3>
                    <div className="space-y-2 text-gray-300 text-sm">
                      <p><strong>Название:</strong> Burning Spice Story</p>
                      <p><strong>Версия:</strong> 1.0.0</p>
                      <p><strong>Жанр:</strong> Визуальная новелла / Яой / Пародия</p>
                      <p><strong>Платформа:</strong> Web (React + TypeScript)</p>
                      <p className="pt-2 text-xs text-gray-500">
                        Это фан-проект, основанный на персонажах Cookie Run Kingdom.
                        Создано для развлечения и не является официальным продуктом.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-orange-800 hover:bg-orange-950/50"
                      onClick={() => {
                        if (confirm('Вы уверены, что хотите сбросить все настройки?')) {
                          setVolume(70);
                          setTextSpeed(50);
                          setAutoPlay(false);
                        }
                      }}
                    >
                      <Icon name="RotateCcw" size={18} className="mr-2" />
                      Сбросить настройки
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => {
                        if (confirm('Вы уверены, что хотите удалить ВСЕ данные? Это действие необратимо!')) {
                          setCurrentDialogue(0);
                          setAffectionLevel(0);
                          setUnlockedEndings([]);
                          setUnlockedGallery([]);
                          setSaves([]);
                          setAchievements(achievements.map(a => ({ ...a, unlocked: false })));
                        }
                      }}
                    >
                      <Icon name="Trash2" size={18} className="mr-2" />
                      Удалить все данные
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="saves" className="space-y-6">
              <Card className="p-6 md:p-8 bg-gradient-to-b from-black/60 to-black/40 backdrop-blur-lg border-orange-800/50 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-orange-400 flex items-center gap-3">
                  <Icon name="Save" size={32} />
                  Сохранения
                </h2>
                
                {currentSection === 'menu' && (
                  <div className="mb-6 p-4 bg-blue-950/30 rounded-lg border border-blue-800/30">
                    <p className="text-gray-300 text-sm flex items-start gap-2">
                      <Icon name="Info" size={18} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <span>
                        Начните игру, чтобы создавать сохранения. Сохранения можно создать в любой момент игры.
                      </span>
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((slotId) => {
                    const save = saves.find(s => s.id === slotId);
                    return (
                      <div 
                        key={slotId}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          save 
                            ? 'bg-gradient-to-br from-orange-950/30 to-red-950/30 border-orange-700/50 hover:border-orange-600' 
                            : 'bg-gray-950/30 border-gray-800/30 hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-lg text-gray-300 flex items-center gap-2">
                            <Icon name="FileText" size={20} />
                            Слот {slotId}
                          </h3>
                          {save && (
                            <Badge variant="outline" className="bg-green-950/50 text-green-400 border-green-700">
                              <Icon name="Check" size={14} className="mr-1" />
                              Занят
                            </Badge>
                          )}
                        </div>
                        
                        {save ? (
                          <div className="space-y-2 mb-4">
                            <p className="text-sm text-gray-400">
                              <Icon name="Clock" size={14} className="inline mr-1" />
                              {save.timestamp}
                            </p>
                            <p className="text-sm text-gray-400">
                              <Icon name="Heart" size={14} className="inline mr-1" />
                              Привязанность: <span className="text-orange-400 font-bold">{save.affection}</span>
                            </p>
                            <p className="text-sm text-gray-400">
                              <Icon name="MessageSquare" size={14} className="inline mr-1" />
                              Диалог #{save.dialogueId}
                            </p>
                            {save.unlockedEndings.length > 0 && (
                              <p className="text-sm text-gray-400">
                                <Icon name="Star" size={14} className="inline mr-1" />
                                Концовок: {save.unlockedEndings.length}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                            <Icon name="FileQuestion" size={16} />
                            Пустой слот
                          </p>
                        )}
                        
                        <div className="flex gap-2">
                          {save ? (
                            <>
                              <Button 
                                size="sm" 
                                className="flex-1 bg-orange-600 hover:bg-orange-700"
                                onClick={() => handleLoad(save)}
                              >
                                <Icon name="Upload" size={16} className="mr-1" />
                                Загрузить
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => {
                                  if (confirm('Удалить это сохранение?')) {
                                    setSaves(saves.filter(s => s.id !== slotId));
                                  }
                                }}
                              >
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 border-gray-700 hover:bg-gray-800"
                              disabled
                            >
                              <Icon name="Lock" size={16} className="mr-1" />
                              Пусто
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {saves.length > 0 && (
                  <div className="mt-6 p-4 bg-orange-950/30 rounded-lg border border-orange-800/30">
                    <p className="text-gray-300 text-sm flex items-center gap-2">
                      <Icon name="Database" size={18} className="text-orange-400" />
                      Всего сохранений: {saves.length} из 4
                    </p>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col justify-end p-4 md:p-6">
            <Card className="max-w-4xl mx-auto w-full bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-xl border-orange-800/50 shadow-2xl">
              <div className="p-6 md:p-8">
                <div className="mb-4 flex items-center justify-between">
                  <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-1">
                    <Icon name="User" size={16} className="mr-1" />
                    {currentNode.speaker}
                  </Badge>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant="outline" 
                      className={`${getAffectionColor()} border-current`}
                    >
                      <Icon name="Heart" size={16} className="mr-1" />
                      {getAffectionLabel()}: {affectionLevel}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCurrentSection('menu');
                      }}
                      className="border-gray-700 hover:bg-gray-800"
                    >
                      <Icon name="Menu" size={16} className="mr-1" />
                      Меню
                    </Button>
                  </div>
                </div>

                <div className="min-h-[200px] mb-6">
                  <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
                    {currentNode.text}
                  </p>
                </div>

                {currentNode.choices ? (
                  <div className="space-y-3">
                    {currentNode.choices.map((choice, index) => (
                      <Button
                        key={index}
                        className="w-full justify-start text-left h-auto py-4 px-6 bg-gradient-to-r from-orange-900/40 to-red-900/40 hover:from-orange-800/60 hover:to-red-800/60 border-2 border-orange-700/30 hover:border-orange-600 transition-all duration-300"
                        onClick={() => handleChoice(choice)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <Icon name="ChevronRight" size={20} className="text-orange-400 mt-0.5 flex-shrink-0" />
                          <span className="text-base md:text-lg text-gray-200">{choice.text}</span>
                          {choice.affection !== 0 && (
                            <Badge 
                              variant="outline"
                              className={`ml-auto ${
                                choice.affection > 0 
                                  ? 'bg-green-950/50 text-green-400 border-green-700' 
                                  : 'bg-red-950/50 text-red-400 border-red-700'
                              }`}
                            >
                              {choice.affection > 0 ? '+' : ''}{choice.affection}
                            </Badge>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <Button
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-lg py-6"
                    onClick={handleContinue}
                  >
                    <Icon name="ArrowRight" size={20} className="mr-2" />
                    Продолжить
                  </Button>
                )}

                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {[1, 2, 3, 4].map((slotId) => (
                    <Button
                      key={slotId}
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave(slotId)}
                      className="border-orange-700 hover:bg-orange-950/50"
                    >
                      <Icon name="Save" size={14} className="mr-1" />
                      Сохранить {slotId}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
